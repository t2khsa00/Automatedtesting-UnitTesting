import request from 'supertest';
import { beforeEach, afterEach, describe, it, expect, vi } from 'vitest';
import app from '../index';

describe('Dog API', () => {
	const fakeImage = 'https://images.dog.ceo/breeds/hound-afghan/n02088094_1003.jpg';

	beforeEach(() => {
  vi.stubGlobal(
    'fetch',
    vi.fn(() =>
      Promise.resolve({
        ok: true,
        status: 200,
        json: () => Promise.resolve({ message: fakeImage, status: 'success' }),
      }) as unknown as Response
    )
  );
});

	afterEach(() => {
		vi.restoreAllMocks();
	});

	it('GET /api/dogs/random - returns random dog image (positive)', async () => {
		const res = await request(app).get('/api/dogs/random');

		expect(res.status).toBe(200);
		expect(res.body).toHaveProperty('success', true);
		expect(res.body).toHaveProperty('data');
		expect(res.body.data).toHaveProperty('imageUrl');
		expect(typeof res.body.data.imageUrl).toBe('string');
		expect(res.body.data.imageUrl).toBe(fakeImage);
	});

	it('GET /api/dogs/invalid - returns 404 with error message (negative)', async () => {
		const res = await request(app).get('/api/dogs/invalid');

		expect(res.status).toBe(404);
		expect(res.body).toHaveProperty('success', false);
		expect(res.body).toHaveProperty('error');
		expect(typeof res.body.error).toBe('string');
		expect(res.body.error).toBe('Route not found');
	});
});

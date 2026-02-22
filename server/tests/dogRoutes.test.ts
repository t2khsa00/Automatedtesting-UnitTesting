import { describe, it, expect, beforeEach, vi } from "vitest";
import express from "express";
import request from "supertest";

vi.mock("../controllers/dogController", () => ({
  getDogImage: vi.fn(),
}));

import dogRoutes from "../routes/dogRoutes";
import { getDogImage } from "../controllers/dogController";

describe("dogRoutes test", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should return 200 and success true for /api/dogs/random", async () => {
    (getDogImage as any).mockImplementation((_req: any, res: any) => {
      return res.status(200).json({
        success: true,
        data: { imageUrl: "https://mocked.jpg", status: "success" },
      });
    });

    const app = express();
    app.use("/api/dogs", dogRoutes);

    const response = await request(app).get("/api/dogs/random");

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.data.imageUrl).toContain("mocked");
  });
    it("should return 500 and error for /api/dogs/random", async () => {
    (getDogImage as any).mockImplementation((_req: any, res: any) => {
      return res.status(500).json({
        success: false,
        error: "Failed to fetch dog image: Network error",
      });
    });

    const app = express();
    app.use("/api/dogs", dogRoutes);

    const response = await request(app).get("/api/dogs/random");

    expect(response.status).toBe(500);
    expect(response.body.success).toBe(false);
    expect(response.body.error).toBe(
      "Failed to fetch dog image: Network error"
    );
  });
});
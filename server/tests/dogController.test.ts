import { describe, it, expect, vi, beforeEach } from "vitest";
import { getDogImage } from "../controllers/dogController";
import * as dogService from "../services/dogService";

describe("dogController test", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it("should return success true and mocked JSON from service", async () => {
    const mockedServiceData = {
      imageUrl: "https://mocked-url.jpg",
      status: "success",
    };

    vi.spyOn(dogService, "getRandomDogImage").mockResolvedValue(mockedServiceData);

    const req = {} as any;
    const res = {
      json: vi.fn(),
      status: vi.fn().mockReturnThis(),
    } as any;

    await getDogImage(req, res);

    expect(res.json).toHaveBeenCalledWith({
      success: true,
      data: mockedServiceData,
    });
  });
});
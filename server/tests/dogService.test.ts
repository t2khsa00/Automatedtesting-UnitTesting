import { describe, it, expect, vi, beforeEach } from "vitest";
import { getRandomDogImage } from "../services/dogService";

describe("dogService tests", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it("should return imageUrl same as message and status success", async () => {
    const mockedData = {
      message: "https://images.dog.ceo/breeds/terrier-welsh/lucy.jpg",
      status: "success",
    };

    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => mockedData,
    });

    vi.stubGlobal("fetch", fetchMock as unknown as typeof fetch);

    const result = await getRandomDogImage();

    expect(result.imageUrl).toBe(mockedData.message);
    expect(result.status).toBe("success");
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });
  it("should throw error when response is not ok", async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: false,
      status: 500,
    });

    vi.stubGlobal("fetch", fetchMock as unknown as typeof fetch);

    await expect(getRandomDogImage()).rejects.toThrow(
      "Failed to fetch dog image: Dog API returned status 500"
    );
  });
});
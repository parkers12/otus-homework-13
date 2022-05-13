import { getCurrentLocation } from "./getCurrentLocation";

describe("getCurrentLocation", () => {
  let originalFetch;

  beforeEach(() => {
    originalFetch = window.fetch;
  });

  it("get user location", async () => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        json: () => Promise.resolve({ city: { name_ru: "Moscow" } }),
      })
    );
    const city = await getCurrentLocation();
    expect(city).toEqual("Moscow");
    expect(fetch).toHaveBeenCalledTimes(1);
  });

  it("user location get error", async () => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        json: () => Promise.reject(new Error("something bad happened")),
      })
    );
    const error = await getCurrentLocation();
    expect(error).toEqual(false);
  });

  afterEach(() => {
    global.fetch = originalFetch;
  });
});

import createGoogleMapsMock from "jest-google-maps-mock";
import markup from "./markup";
import {
  getSign,
  dataViewer,
  getData,
  handleCity,
  getTemperature,
  dateConvert,
  timeTranslater,
  getPressure,
  getTimeStamp,
  getDirectionWind,
  getWeather,
  getLocalStorage,
  saveCity,
  handleClick,
} from "./functions";

describe("handleClick", () => {
  const body = document.querySelector("body");
  const app = document.createElement("div");
  body.appendChild(app).setAttribute("id", "app");
  markup(app);

  describe("getSign", () => {
    it("plus is added to the positive value", () => {
      const value = 25;
      expect(getSign(value)).toBe("+25");
    });
    it("zero is returned zero", () => {
      const value = 0;
      expect(getSign(value)).toBe(0);
    });
    it("negative zero is returned zero", () => {
      const value = -0;
      expect(getSign(value)).toBe(0);
    });
    it("plus is not added to the negative value", () => {
      const value = -25;
      expect(getSign(value)).toBe(-25);
    });
  });

  describe("dataViewer", () => {
    const weather = document.getElementById("weather");
    const plugWeather = document.getElementById("plugWeather");
    const displayWthAfter = window
      .getComputedStyle(weather, null)
      .getPropertyValue("display");
    const displayPWthAfter = window
      .getComputedStyle(plugWeather, null)
      .getPropertyValue("display");
    it("hiding weather and showing plug", () => {
      if (displayWthAfter === "block" && displayPWthAfter === "none") {
        dataViewer("memory", "none");
        dataViewer("plugList", "block");
        const displayWthBefore = window
          .getComputedStyle(weather, null)
          .getPropertyValue("display");
        const displayPWthBefore = window
          .getComputedStyle(plugWeather, null)
          .getPropertyValue("display");
        expect(displayWthBefore).toBe("none");
        expect(displayPWthBefore).toBe("block");
      }
    });
    it("hiding plug and showing weather", () => {
      if (displayWthAfter === "none" && displayPWthAfter === "block") {
        dataViewer("memory", "block");
        dataViewer("plugList", "none");
        const displayWthBefore = window
          .getComputedStyle(weather, null)
          .getPropertyValue("display");
        const displayPWthBefore = window
          .getComputedStyle(plugWeather, null)
          .getPropertyValue("display");
        expect(displayWthBefore).toBe("block");
        expect(displayPWthBefore).toBe("none");
      }
    });
  });

  describe("getData", () => {
    it("receiving data from the weather server", () => {
      const city = "Moscow";
      const json = getData(city, false);
      const APIkey = "2f3499bf11f061c267af42038ae180bc";
      // eslint-disable-next-line max-len
      const string = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${APIkey}`;
      expect(json).toBe(string);
    });

    it("receiving data from the maps.googleapis", () => {
      const city = "Moscow";
      const json = getData(city, true);
      const APIkey = "AIzaSyB6Y7wf4TCspmqw-ndjkh9yjWk1EW_Eubs";
      // eslint-disable-next-line max-len
      const string = `https://maps.googleapis.com/maps/api/geocode/json?address=${city}&language=en&key=${APIkey}`;
      expect(json).toBe(string);
    });
  });

  describe("handleCity", () => {
    const weather = document.getElementById("weather");
    const plugWeather = document.getElementById("plugWeather");
    const map = document.getElementById("map");
    const plugImage = document.getElementById("plugImage");
    it("component weather: incorrect city entered", () => {
      handleCity(false);
      const displayWeather = window
        .getComputedStyle(weather, null)
        .getPropertyValue("display");
      const displayPlug = window
        .getComputedStyle(plugWeather, null)
        .getPropertyValue("display");
      expect(displayWeather).toBe("block");
      expect(displayPlug).toBe("none");
    });
    it("component weather: correct city entered", () => {
      handleCity(true);
      const displayWeather = window
        .getComputedStyle(weather, null)
        .getPropertyValue("display");
      const displayPlug = window
        .getComputedStyle(plugWeather, null)
        .getPropertyValue("display");
      expect(displayWeather).toBe("none");
      expect(displayPlug).toBe("flex");
    });
    it("component map: incorrect city entered", () => {
      handleCity(false);
      const displayWeather = window
        .getComputedStyle(map, null)
        .getPropertyValue("display");
      const displayPlug = window
        .getComputedStyle(plugImage, null)
        .getPropertyValue("display");
      expect(displayWeather).toBe("block");
      expect(displayPlug).toBe("none");
    });
    it("component map: correct city entered", () => {
      handleCity(true);
      const displayWeather = window
        .getComputedStyle(map, null)
        .getPropertyValue("display");
      const displayPlug = window
        .getComputedStyle(plugImage, null)
        .getPropertyValue("display");
      expect(displayWeather).toBe("none");
      expect(displayPlug).toBe("flex");
    });
  });

  describe("Getter functions", () => {
    let originalFetch;
    beforeEach(() => {
      originalFetch = window.fetch;
    });

    describe("getTemperature", () => {
      it("get temperature in cities", async () => {
        window.fetch = jest.fn(() =>
          Promise.resolve({
            ok: true,
            json: () =>
              Promise.resolve({
                city: "Moscow",
                main: { temp: 15 },
                cod: 200,
              }),
          })
        );
        const data = await getTemperature("Moscow");
        expect(data).toEqual("+15");
        expect(fetch).toHaveBeenCalledTimes(1);
      });

      it("return 404 temperature in cities", async () => {
        window.fetch = jest.fn(() =>
          Promise.resolve({
            json: () =>
              Promise.resolve({
                cod: 404,
              }),
          })
        );
        const temp = await getTemperature("ri12oe23");
        expect(temp).toBe("data not found");
      });

      it("return error get temperature in cities", async () => {
        window.fetch = jest.fn(() =>
          Promise.resolve({
            json: () => Promise.reject(new Error("something bad happened")),
          })
        );
        const response = await getTemperature("Moscow");
        expect(response).toBe("data not found");
      });

      it("get temperature return reject", async () => {
        window.fetch = jest.fn(() =>
          Promise.reject(new Error("something bad happened"))
        );
        const data = await getTemperature("Moscow");
        expect(data).toBe(false);
      });
    });

    describe("getWeather", () => {
      it("get weather in city", async () => {
        window.fetch = jest.fn(() =>
          Promise.resolve({
            json: () =>
              Promise.resolve({
                name: "Moscow",
                weather: [
                  {
                    icon: "04n",
                    description: "overcast clouds",
                  },
                ],
                wind: {
                  speed: 2.8,
                  deg: 156,
                },
                main: {
                  temp: 7.64,
                  feels_like: 5.8,
                  humidity: 60,
                  pressure: 1016,
                },
                sys: {
                  sunset: 1634049464,
                  sunrise: 1634010839,
                },
                coord: {
                  lat: 55.7522,
                  lon: 37.6156,
                },
                timezone: 10800,
                cod: 200,
              }),
          })
        );
        await getWeather("Moscow");
        expect(fetch).toHaveBeenCalledTimes(1);
      });

      it("return error get temperature in cities", async () => {
        window.fetch = jest.fn(() =>
          Promise.resolve({
            json: () => Promise.reject(new Error("something bad happened")),
          })
        );
        const error = await getTemperature("Moscow");
        expect(error).toBe("data not found");
      });
    });

    afterEach(() => {
      window.fetch = originalFetch;
    });
  });

  describe("createGoogleMapsMock", () => {
    let googleMaps;

    beforeEach(() => {
      googleMaps = createGoogleMapsMock();
    });

    it("should create a map mock", () => {
      const mapDiv = document.createElement("div");
      // eslint-disable-next-line no-new
      new googleMaps.Map(mapDiv);

      expect(googleMaps.Map).toHaveBeenCalledTimes(1);
      expect(googleMaps.Map.mock.instances.length).toBe(1);
      expect(googleMaps.Map).toHaveBeenLastCalledWith(mapDiv);
    });
  });

  describe("dateConvert", () => {
    it("convert the fractional of a number 6.60 to minutes", () => {
      const date = 6.6;
      dateConvert(date);
      expect(dateConvert(date)).toBe("6:36");
    });
    it("convert the fractional of a number 20.90 to minutes", () => {
      const date = 20.9;
      dateConvert(date);
      expect(dateConvert(date)).toBe("20:54");
    });
    it("convert the fractional of a number 13.12 to minutes", () => {
      const date = 13.12;
      dateConvert(date);
      expect(dateConvert(date)).toBe("13:07");
    });
  });

  describe("timeTranslater", () => {
    it("converting milliseconds to time: daylight hours", () => {
      const value = timeTranslater(1633273251 - 1633232166, 3600, 2);
      expect(value).toBe("11.41");
    });
  });

  describe("getPressure", () => {
    it("converting pressure from hPa to mmHg Art.", () => {
      const value = getPressure(1035);
      expect(value).toBe("776");
    });
  });

  describe("getTimeStamp", () => {
    it("timestamp start current day", () => {
      class MockDate extends Date {
        constructor() {
          super(1634017006);
        }
      }
      global.Date = MockDate;
      const stamp = getTimeStamp(1634017006, 0);
      expect(stamp).toBe(1634017);
    });
  });

  describe("getDirectionWind", () => {
    it("determine the north wind", () => {
      expect(getDirectionWind(345)).toBe("N");
    });
    it("determine the northeastern wind", () => {
      expect(getDirectionWind(24)).toBe("NE");
    });
    it("determine the eastern wind", () => {
      expect(getDirectionWind(113)).toBe("E");
    });
    it("determine the southeastern wind", () => {
      expect(getDirectionWind(157)).toBe("SE");
    });
    it("determine the south wind", () => {
      expect(getDirectionWind(159)).toBe("S");
    });
    it("determine the southwestern wind", () => {
      expect(getDirectionWind(204)).toBe("SW");
    });
    it("determine the western wind", () => {
      expect(getDirectionWind(249)).toBe("W");
    });
    it("determine the northwestern wind", () => {
      expect(getDirectionWind(297)).toBe("NW");
    });
  });

  describe("getLocalStorage", () => {
    const localStor = localStorage.weatherForecast;
    localStorage.removeItem(localStor);
    const plugList = document.getElementById("plugList");
    it("get empty localStorage", () => {
      const localStorAfter = localStorage.weatherForecast;
      expect(typeof localStorAfter === "undefined").toBe(true);
    });

    it("displaying block of empty localStorage", () => {
      getLocalStorage();
      const displayPlug = window
        .getComputedStyle(plugList, null)
        .getPropertyValue("display");

      const numCity = document.querySelectorAll("#memory > div").length;
      expect(displayPlug).toBe("block");
      expect(numCity).toBe(0);
    });

    it("displaying localStorage with data", async () => {
      localStorage.removeItem(localStor);
      const city = "Las Vegas";
      localStorage.setItem("weatherForecast", city);
      await getLocalStorage();
      const localStorAfter = document
        .querySelector("body")
        .querySelector("div.memory")
        .querySelector("div.block")
        .querySelector("div.label").textContent;
      expect(localStorAfter).toBe(city);
    });
  });

  describe("saveCity", () => {
    const localStorBefore = localStorage.weatherForecast;
    localStorage.removeItem(localStorBefore);

    it("save first city", () => {
      const city = "Las Vegas";
      saveCity(city);
      const localStorAfter = localStorage.weatherForecast;
      expect(localStorAfter).toBe(city);
    });

    it("save more city", () => {
      saveCity("London");
      saveCity("Paris");
      saveCity("Berlin");
      const localStorAfter = localStorage.weatherForecast;
      expect(localStorAfter).toBe("Las Vegas,London,Paris,Berlin");
    });
  });

  describe("handleClick", () => {
    const input = document.getElementById("input");

    it("the entered city has been verified", () => {
      input.value = "Barcelona";
      const result = handleClick();
      expect(result).toBe("Barcelona");
    });
    it("the entered city did not pass the test", () => {
      input.value = "2ew4ere34343";
      const result = handleClick();
      expect(result).toBe("error");
    });
  });
});

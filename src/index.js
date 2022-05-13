import "./styles/styles.css";
import markup from "./js/markup";
import {
  handleClick,
  getWeather,
  getLocalStorage,
  getMapCity,
  dataViewer,
  handleCity,
} from "./js/functions";
import { getCurrentLocation } from "./js/getCurrentLocation";

function startFunction() {
  const app = document.getElementById("app");
  markup(app);

  (async function renderMap() {
    const script = document.createElement("script");
    script.src =
      // eslint-disable-next-line max-len
      "https://maps.googleapis.com/maps/api/js?key=AIzaSyB6Y7wf4TCspmqw-ndjkh9yjWk1EW_Eubs&callback=initMap&v=weekly";
    script.defer = true;
    window.initMap = function foo() {
      // eslint-disable-next-line no-new
      new window.google.maps.Map(document.getElementById("map"), {
        zoom: 12,
        center: { lat: -34.397, lng: 150.644 },
      });
    };
    document.head.appendChild(script);
  })();

  (async function getCity() {
    getWeather(await getCurrentLocation());
    getLocalStorage();
  })();

  function getHandleClick() {
    const input = document.getElementById("input");
    const city = document.getElementById("city");
    const result = handleClick();
    if (result !== "error") {
      getMapCity(result);
      dataViewer("data", "flex");
      city.textContent = input.value;
    } else {
      handleCity(true);
    }
  }

  const button = document.getElementById("button");
  button.addEventListener("click", getHandleClick);
  document.addEventListener("keyup", ({ key }) => {
    if (key === "Enter") {
      getHandleClick();
    }
  });
}

document.addEventListener("DOMContentLoaded", startFunction());

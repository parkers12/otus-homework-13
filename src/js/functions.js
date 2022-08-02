import CityList from "./cityList.ts";

export function getSign(value) {
  let digit;
  const data = Number(value);
  if (data > 0) {
    digit = `+${data}`;
  } else if (data === 0) {
    digit = 0;
  } else {
    digit = data;
  }
  return digit;
}

export function dataViewer(block, type) {
  const el = document.getElementById(block);
  el.style.display = type;
}

export function getData(city, sourse) {
  let link;
  if (sourse) {
    const APIkey = "AIzaSyB6Y7wf4TCspmqw-ndjkh9yjWk1EW_Eubs";
    const str = encodeURIComponent(city.trim());
    // eslint-disable-next-line max-len
    link = `https://maps.googleapis.com/maps/api/geocode/json?address=${str}&language=en&key=${APIkey}`;
  } else {
    const APIkey = "2f3499bf11f061c267af42038ae180bc";
    // eslint-disable-next-line max-len
    link = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${APIkey}`;
  }
  return link;
}

export function handleCity(value) {
  const input = document.getElementById("input");
  const data = document.getElementById("data");
  if (value) {
    input.classList.add("wrong");
    dataViewer("plugWeather", "flex");
    dataViewer("weather", "none");
    dataViewer("cityBlock", "none");
    dataViewer("map", "none");
    dataViewer("plugImage", "flex");
    data.classList.add("empty");
  } else {
    input.classList.remove("wrong");
    dataViewer("weather", "block");
    dataViewer("cityBlock", "flex");
    dataViewer("plugWeather", "none");
    dataViewer("map", "block");
    dataViewer("plugImage", "none");
    data.classList.remove("empty");
  }
}

export async function getTemperature(city) {
  try {
    const url = getData(city, false);
    const response = await fetch(url);
    if (response.ok) {
      const data = await response.json();
      if (data.cod === 200) {
        return getSign(data.main.temp.toFixed());
      }
      return "data not found";
    }
    return "data not found";
  } catch (error) {
    console.log(`Error: ${error.message}`);
    console.log(error.response);
    return false;
  }
}

export function getMap(latitude, longitude) {
  const myLatLng = { lat: latitude, lng: longitude };
  const map = new window.google.maps.Map(document.getElementById("map"), {
    zoom: 12,
    center: myLatLng,
  });
  // eslint-disable-next-line no-new
  new window.google.maps.Marker({
    position: myLatLng,
    map,
    title: "Your location",
  });
}

export function dateConvert(value) {
  const hour = Math.trunc(value);
  let min = 60 * (value - hour);
  min = min.toFixed();
  if (min < 10) {
    min = `0${min}`;
  }
  return `${hour}:${min}`;
}

export function timeTranslater(value, delim, fixed) {
  return (value / delim).toFixed(fixed);
}

export function getPressure(value) {
  return (value * 0.750064).toFixed(0);
}

export function getTimeStamp(date1, timezone) {
  const x = new Date();
  const currentTimeZoneOffset = x.getTimezoneOffset() * 60;
  const value = date1 + timezone + currentTimeZoneOffset;
  const date = new Date(value * 1000);
  const srtDay = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  return Date.parse(srtDay) / 1000;
}

export function getDirectionWind(value) {
  let wind;
  const deg = Number(value).toFixed();
  if ((deg > 338 && deg <= 360) || (deg >= 0 && deg <= 23)) {
    wind = "N";
  } else if (deg > 23 && deg <= 68) {
    wind = "NE";
  } else if (deg > 68 && deg <= 113) {
    wind = "E";
  } else if (deg > 113 && deg <= 158) {
    wind = "SE";
  } else if (deg > 158 && deg <= 203) {
    wind = "S";
  } else if (deg > 203 && deg <= 248) {
    wind = "SW";
  } else if (deg > 248 && deg <= 293) {
    wind = "W";
  } else if (deg > 293 && deg <= 338) {
    wind = "NW";
  }
  return wind;
}

export async function getWeather(city) {
  const url = getData(city, false);
  try {
    const response = await fetch(url);
    const data = await response.json();
    if (data.cod === 200) {
      document.getElementById("city").innerHTML = data.name;
      // eslint-disable-next-line max-len
      const iconUrl = `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;
      const cityBlock = document.getElementById("cityBlock");
      const icon = document.getElementById("icon");
      const styles = `background-image: url("${iconUrl}");`;
      cityBlock.appendChild(icon).setAttribute("style", styles);
      cityBlock
        .appendChild(icon)
        .setAttribute("title", data.weather[0].description);
      document.getElementById("wind").innerHTML = data.wind.speed.toFixed();
      document.getElementById("directionWind").innerHTML = getDirectionWind(
        data.wind.deg
      );
      document.getElementById("pressure").innerHTML = getPressure(
        data.main.pressure
      );
      document.getElementById("temp").innerHTML = getSign(
        data.main.temp.toFixed()
      );
      document.getElementById("feelsLike").innerHTML = getSign(
        data.main.feels_like.toFixed()
      );
      document.getElementById("humidity").innerHTML = data.main.humidity;
      document.getElementById("sunrise").innerHTML = dateConvert(
        timeTranslater(
          data.sys.sunrise - getTimeStamp(data.sys.sunrise, data.timezone),
          3600,
          2
        )
      );
      document.getElementById("sunset").innerHTML = dateConvert(
        timeTranslater(
          data.sys.sunset - getTimeStamp(data.sys.sunset, data.timezone),
          3600,
          2
        )
      );
      document.getElementById("lengthDay").innerHTML = dateConvert(
        timeTranslater(data.sys.sunset - data.sys.sunrise, 3600, 2)
      );
      getMap(data.coord.lat, data.coord.lon);
      dataViewer("data", "flex");
      return true;
    }
    handleCity(true);
    dataViewer("data", "flex");
    return false;
  } catch (error) {
    console.log(`Error: ${error.message}`);
    console.log(error.response);
    return false;
  }
}

function getClicker() {
  setTimeout(() => {
    const memory = document.getElementById("memory");
    memory.onclick = function foo(e) {
      const classElem = e.target.getAttribute("class");
      if (classElem === "block") {
        getWeather(e.target.getAttribute("id"));
      } else {
        getWeather(e.target.parentNode.getAttribute("id"));
      }
    };
  }, 300);
}

// function getWeatherCities(city, temp, id) {
//   const memory = document.getElementById("memory");
//   const block = document.createElement("div");
//   memory.appendChild(block).setAttribute("id", city);
//   memory.appendChild(block).setAttribute("class", "block");
//   const param = document.createElement("div");
//   block.appendChild(param).setAttribute("id", id);
//   block.appendChild(param).setAttribute("class", "label btn");
//   param.innerHTML = city;
//   const prop = document.createElement("div");
//   block.appendChild(prop).setAttribute("class", "value");
//   prop.innerHTML = temp;
//   memory.style.display = "block";
// }

export async function getLocalStorage() {
  await null;
  const localStor = localStorage.weatherForecast;
  if (typeof localStor === "undefined") {
    dataViewer("memory", "none");
    dataViewer("plugList", "block");
  } else {
    const memory = document.querySelectorAll("#memory > div");
    for (let j = 0; j < memory.length; j += 1) {
      memory[j].remove();
    }
    // const arr = localStor.split(",");
    // for (let i = 0; i < arr.length; i += 1) {
    //   (async function getTemp() {
    //     const temp = await getTemperature(arr[i]);
    //     // getWeatherCities(arr[i], temp, i);

    //     // CityList.render(arr[i], temp, i);
    //     // console.log(temp);
    //   })();
    // }
    const cityList = new CityList();
    cityList.render();
    dataViewer("memory", "block");
    dataViewer("plugList", "none");
    // getClicker();

    const memoryBl = document.getElementById("memory");
    memoryBl.addEventListener("click", CityList.subscribeToEvents);
  }
}

export function saveCity(city) {
  const localStor = localStorage.weatherForecast;
  if (typeof localStor === "undefined") {
    localStorage.setItem("weatherForecast", city);
  } else {
    const arr = localStor.split(",");
    if (arr.indexOf(city) === -1) {
      if (arr.length === 10) {
        arr.shift();
      }
      const cityUpper = city[0].toUpperCase() + city.substring(1);
      arr.push(cityUpper);
      const string = arr.join();
      localStorage.setItem("weatherForecast", string);
    }
  }
  getLocalStorage();
}

export async function getMapCity(value) {
  const location = getData(value, true);
  try {
    const response = await fetch(location);
    const data = await response.json();
    if (data.status === "OK") {
      let city = data.results[0].address_components[0].long_name;
      if (city === "" || Number.isInteger(+city)) {
        city = value;
      }
      getWeather(city);
      handleCity(false);
      saveCity(city);
    } else {
      handleCity(true);
    }
  } catch (error) {
    console.log(`Error: ${error.message}`);
    console.log(error.response);
  }
}

export function handleClick() {
  const input = document.getElementById("input");
  const regexp = /^[a-zA-Z]+(?:[\s-][a-zA-Z]+)*$/gi;
  if (regexp.test(input.value)) {
    return input.value;
  }
  return "error";
}

export default function markup(elem) {
  const wrapper = document.createElement("div");
  elem.appendChild(wrapper).setAttribute("class", "wrapper");
  const content = document.querySelector(".wrapper");

  const header = document.createElement("header");
  content.appendChild(header).setAttribute("class", "header");

  const title = document.createElement("h1");
  header.appendChild(title).setAttribute("class", "title");
  title.innerHTML = "Weather in your city";

  const form = document.createElement("div");
  header.appendChild(form).setAttribute("class", "form");

  const input = document.createElement("input");
  form.appendChild(input).setAttribute("id", "input");
  form.appendChild(input).setAttribute("class", "input");
  form.appendChild(input).setAttribute("type", "text");
  form.appendChild(input).setAttribute("name", "city");
  form.appendChild(input).setAttribute("placeholder", "Enter your city");
  form.appendChild(input).setAttribute("required", "required");
  form.appendChild(input).autofocus = true;

  const button = document.createElement("button");
  form.appendChild(button).setAttribute("id", "button");
  form.appendChild(button).setAttribute("class", "button");
  form.appendChild(button).setAttribute("type", "submit");
  form.appendChild(button).setAttribute("value", "");

  const main = document.createElement("main");
  content.appendChild(main).setAttribute("id", "main");
  content.appendChild(main).setAttribute("class", "main");

  const data = document.createElement("div");
  main.appendChild(data).setAttribute("id", "data");
  main.appendChild(data).setAttribute("class", "data");

  const section = document.createElement("section");
  data.appendChild(section).setAttribute("class", "section");

  const dataWeather = document.createElement("div");
  section.appendChild(dataWeather).setAttribute("id", "dataWeather");
  section.appendChild(dataWeather).setAttribute("class", "dataWeather");

  const cityBlock = document.createElement("div");
  dataWeather.appendChild(cityBlock).setAttribute("id", "cityBlock");
  dataWeather.appendChild(cityBlock).setAttribute("class", "cityBlock");

  const cityTitle = document.createElement("h2");
  cityBlock.appendChild(cityTitle).setAttribute("id", "city");
  cityBlock.appendChild(cityTitle).setAttribute("class", "city");

  const icon = document.createElement("div");
  cityBlock.appendChild(icon).setAttribute("id", "icon");
  cityBlock.appendChild(icon).setAttribute("class", "icon");

  const weather = document.createElement("div");
  dataWeather.appendChild(weather).setAttribute("id", "weather");
  dataWeather.appendChild(weather).setAttribute("class", "weather");

  const weatherParam = {
    temp: "Temperature, &#8451;",
    feelsLike: "Feels like, &#8451;",
    wind: "Wind, m/s",
    directionWind: "Direction wind",
    pressure: "Pressure, mmHg Art.",
    humidity: "Humidity, %",
    sunrise: "Sunrise",
    sunset: "Sunset",
    lengthDay: "Length of the day",
  };

  const keys = Object.keys(weatherParam);
  const values = Object.values(weatherParam);
  for (let i = 0; i < keys.length; i += 1) {
    const block = document.createElement("div");
    weather.appendChild(block).setAttribute("class", "block");
    const param = document.createElement("div");
    block.appendChild(param).setAttribute("class", "label");
    param.innerHTML = values[i];
    const prop = document.createElement("div");
    block.appendChild(prop).setAttribute("id", keys[i]);
    block.appendChild(prop).setAttribute("class", "value");
  }

  const plugWeather = document.createElement("div");
  dataWeather.appendChild(plugWeather).setAttribute("id", "plugWeather");
  dataWeather.appendChild(plugWeather).setAttribute("class", "dataEmpty");
  plugWeather.innerHTML = "Incorrect city";

  /*------------*/
  const list = document.createElement("div");
  section.appendChild(list).setAttribute("id", "list");
  section.appendChild(list).setAttribute("class", "list");

  const subTitle = document.createElement("h2");
  list.appendChild(subTitle).setAttribute("class", "subTitle");
  subTitle.innerHTML = "Weather in cities, &#8451;";

  const memory = document.createElement("div");
  list.appendChild(memory).setAttribute("id", "memory");
  list.appendChild(memory).setAttribute("class", "memory");

  const plugList = document.createElement("div");
  list.appendChild(plugList).setAttribute("id", "plugList");
  list.appendChild(plugList).setAttribute("class", "dataEmpty");
  plugList.innerHTML = "No selected cities";
  /*------------*/

  const aside = document.createElement("div");
  data.appendChild(aside).setAttribute("class", "aside");
  const map = document.createElement("div");
  aside.appendChild(map).setAttribute("class", "map");
  aside.appendChild(map).setAttribute("id", "map");
  aside.appendChild(map).setAttribute("width", "100%");
  aside.appendChild(map).setAttribute("height", "100%");

  const plugImage = document.createElement("div");
  aside.appendChild(plugImage).setAttribute("id", "plugImage");
  aside.appendChild(plugImage).setAttribute("class", "dataEmpty center");
  plugImage.innerHTML = "No image available";
}

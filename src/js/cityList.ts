import { getTemperature, getWeather } from "./functions";

// export class Component<State = string> {
//   private tpl;

//   state: State | undefined;
//   events: {
//       [key: string]: (ev: Event) => void;
//   };

//   constructor(tpl: HTMLElement);
//   subscribeToEvents(): void;
//   setState(city: string, state: string): void;
//   onMount(tpl: HTMLElement): void;
//   render(tpl: string, state: string): string;
// };

interface CityData {
  name: string;
  tmp: string;
}
export class CityList {
  #key: string;
  state: string;
  tpl: string;

  constructor() {
    this.#key = "weatherForecast";
    this.state = localStorage.getItem(this.#key) as string;

    this.tpl = `
      <h2>{{title}}</h2>
      {{if city}}
          <div id="memory" class="memory" style="display: block;">
              {{for cities}}
                  <div id="{{city}}" class="block">
                      <div id="{{i}}" class="label btn">{{city}}</div>
                      <div class="value">{{tmp}}</div>
                  </div>
              {{endfor}}
          </div>
      {{endif}}
    `;
  }

  subscribeToEvents(event: Event): void {
    setTimeout(() => {
      const classElem = event.target.getAttribute("class");
      if (classElem === "block") {
        getWeather(event.target.getAttribute("id"));
      } else {
        getWeather(event.target.parentNode.getAttribute("id"));
      }
    }, 300);
  }

  setState(city: string, state: string): void {
    // const localStor = localStorage.weatherForecast;

    if (typeof state !== null) {
      const arrCity = state.split(",");
      let res = arrCity.find((item) => item === city);
      if (res === undefined) {
        if (state.length === 10) {
          arrCity.shift();
        }
        const cityUpper = city[0].toUpperCase() + city.substring(1);
        // const cityData = {
        //   name: cityUpper,
        //   tmp: 0,
        // };
        // const data = [];
        // data.push(cityData);
        state = state + `,${cityUpper}`;
      }
    } else {
      state = city;
    }
    localStorage.setItem(this.#key, state);
    this.render();
    //getLocalStorage();
  }

  onMount() {}

  render(): string {
    // state = {
    //     title: "Weather in cities, ℃",
    //     data: [
    // {name: "Paris", tmp: 14},
    // {name: "Moscow", tmp: 5},
    // {name: "Tula", tmp: 10}
    // ]
    // }

    let dataWeather: CityData[] = [];
    const arrCity = this.state.split(",");

    arrCity.forEach((element) => {
      let temp: string;
      let cityData: CityData;

      (async function getTemp() {
        temp = (await getTemperature(element)) as string;
        cityData = {
          name: element,
          tmp: temp,
        };
        dataWeather.push(cityData);
      })();
    });

    this.tpl = this.tpl.replace(
      /\{\{if (\w+)}}(.+?)\{\{endif}}/g,
      (tplMatch, grp, subTpl, mth, str) => {
        if (this.state.length > 0) {
          return subTpl;
        }
        return "Data not found";
      }
    );

    this.tpl = this.tpl.replace(
      /\{\{for (\w+)}}(.+?)\{\{endfor}}/g,
      (tplMatch, grp, subTpl, mth, str) => {
        dataWeather.forEach((element, index) => {
          tplMatch.replace(/\{\{(\w+)}}/g, () => element.name);
          tplMatch.replace(/\{\{(\w+)}}/g, () => index);
          tplMatch.replace(/\{\{(\w+)}}/g, () => element.name);
          tplMatch.replace(/\{\{(\w+)}}/g, () => element.tmp);
        });
        return tplMatch;
      }
    );

    this.tpl = this.tpl.replace(/\{\{(\w+)}}/g, (tpl, grp, mth, str) => {
      if (this.state.hasOwnProperty(grp)) {
        return this.state[grp];
      }
      return "Weather in cities, ℃";
    });

    return this.tpl;
  }
}

export default CityList;

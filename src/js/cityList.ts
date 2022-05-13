import { Component } from "./component";

class CityList extends Component {
  #key: string = "weatherForecast";

  private tpl;

  state: State;
  events: {
    [key: string]: (ev: Event) => void;
  };

  constructor(tpl: HTMLElement) {
    super(tpl);

    this.#key = key;

    this.state = JSON.parse(localStorage.getItem(this.#key) as string) || {};

    this.tpl = `<h2>{{title}}</h2>
            {{if city}}
                <div id="memory" class="memory" style="display: block;">
                    {{for cities}}
                        <div id="{{city}}" class="block">
                            <div id="{{i}}" class="label btn">{{city}}</div>
                            <div class="value">{{tmp}}</div>
                        </div>
                    {{endfor}}
                </div>
            {{endif}}`;
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

  setState(city: string, state: {}): void {
    // const localStor = localStorage.weatherForecast;

    if (typeof state === "undefined") {
      state["title"] = "Weather in cities, ℃";
      const cityData = {
        name: city,
        tmp: 0,
      };
      const data = [];
      data.push(cityData);
      state["data"] = data;
      localStorage.setItem(this.#key, JSON.stringify(state));
    } else {
      let res = state["data"].find((item) => item.name === city);
      if (res === undefined) {
        if (state["data"] === 10) {
          state["data"].shift();
        }
        const cityUpper = city[0].toUpperCase() + city.substring(1);
        const cityData = {
          name: cityUpper,
          tmp: 0,
        };
        const data = [];
        data.push(cityData);
        state["data"] = data;
        localStorage.setItem(this.#key, JSON.stringify(state));
      }
    }
    getLocalStorage();
  }

  render(tpl: string, state: {}): string {
    // state = {
    //     title: "Weather in cities, ℃",
    //     data: [
    // {name: "Paris", tmp: 14},
    // {name: "Moscow", tmp: 5},
    // {name: "Tula", tmp: 10}
    // ]
    // }

    tpl = tpl.replace(
      /\{\{if (\w+)}}(.+?)\{\{endif}}/g,
      (tplMatch, grp, subTpl, mth, str) => {
        if (state["data"].length > 0) {
          return subTpl;
        }
        return "Data not found";
      }
    );

    tpl = tpl.replace(
      /\{\{for (\w+)}}(.+?)\{\{endfor}}/g,
      (tplMatch, grp, subTpl, mth, str) => {
        for (let i = 0; i < state["data"].length; i += 1) {
          tplMatch.replace(/\{\{(\w+)}}/g, () => state["data"][i]["city"]);
          tplMatch.replace(/\{\{(\w+)}}/g, () => i);
          tplMatch.replace(/\{\{(\w+)}}/g, () => state["data"][i]["city"]);
          tplMatch.replace(/\{\{(\w+)}}/g, () => state["data"][i]["tmp"]);
        }
        return tplMatch;
      }
    );

    tpl = tpl.replace(/\{\{(\w+)}}/g, (tpl, grp, mth, str) => {
      if (state.hasOwnProperty(grp)) {
        return state[grp];
      }
      return "Weather in cities, ℃";
    });

    return tpl;
  }
}

export default CityList;

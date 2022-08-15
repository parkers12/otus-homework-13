import { getTemperature, getWeather, dataViewer } from "./functions";

export default class Component<State = {}> {
  state: Partial<State>;
  events: {
    [key: string]: (ev: Event) => void;
  };
  constructor(private el: HTMLElement, initialState?: Partial<State>) {
    this.state = initialState || {};
    this.events = {};
    this.el = el;
    this.onMount(el);
  }

  subscribeToEvents(): void {}

  setState(patch: any): void {}

  onMount(el: HTMLElement): void {
    //dataViewer(el, "none");console.log("6");
    //dataViewer("plugList", "block");
    //console.log(el);
    el.style.display = "none";
    const elplug = document.getElementById("plugList") as HTMLDivElement;
    elplug.style.display = "block";

    this.render();

    el.style.display = "block";
    elplug.style.display = "none";
    //dataViewer(el, "block");
    //dataViewer("plugList", "none");
  }

  render(): string {
    const key = "weatherForecast";
    const lS = localStorage.getItem(key) as string;
    const arrCity = lS.split(",");
    //console.log(arrCity,"2");

    /*
    let dataWeather: CityData[] = [];
    const promise = Promise.all(
      arrCity.map(async (element) => {
        const tmp = await getTemperature(element) as string;
        return {name: element, tmp};
      })
    );
    */

    // console.log(dataWeather,"2");

    let htmlCityList = "";
    let tpl = `
      {{if city}}
        {{for cities}}
          <div id="{{city}}" class="block">
            <div id="{{i}}" class="label btn">{{city}}</div>
            <div class="value">{{tmp}}</div>
          </div>
        {{endfor}}
      {{endif}}
    `;

    //const promise1 = promise.then((result) => {
    //dataWeather = result;
    tpl = tpl.replace(
      /\{\{if (\w+)}}(\D+?)\{\{endif}}/,
      (tplMatch, grp, subTpl, mth, str) => {
        if (lS.length > 0) {
          return subTpl;
        }
        return "Data not found";
      }
    );

    const regex = /\{\{(\w+)}}/;

    let currentTpl = "";
    //console.log(tpl, "2");
    tpl = tpl.replace(
      /\{\{for (\w+)}}(\D+?)\{\{endfor}}/g,
      (tplMatch, grp, subTpl, mth, str) => {
        arrCity.forEach((element, index) => {
          currentTpl = subTpl;
          currentTpl = currentTpl.replace(regex, () => element);
          currentTpl = currentTpl.replace(regex, () => index + 1);
          currentTpl = currentTpl.replace(regex, () => element);
          currentTpl = currentTpl.replace(regex, () => "1");
          htmlCityList = htmlCityList + currentTpl;
        });
        return htmlCityList;
      }
    );
    //console.log(htmlCityList, "3");
    return htmlCityList;
    //});

    return "1";
  }
}

interface CityData {
  name: string;
  tmp: string;
}

export class CityList extends Component {
  // constructor() {
  //   super();
  // }
}

// export class CityList extends Component {
//   #key: string;
//   state: string;
//   tpl: string;
//   arrCity: string[];

//   constructor() {

//     this.#key = "weatherForecast";
//     this.state = localStorage.getItem(this.#key) as string;

//     this.tpl = `
//       {{if city}}
//         {{for cities}}
//           <div id="{{city}}" class="block">
//             <div id="{{i}}" class="label btn">{{city}}</div>
//             <div class="value">{{tmp}}</div>
//           </div>
//         {{endfor}}
//       {{endif}}
//     `;

//     this.arrCity = this.state.split(",");

//     this.onMount();
//   }

//   subscribeToEvents(event: Event): void {
//     setTimeout(() => {
//       let classElem;
//       let evt;
//       if(evt){
//         evt = <HTMLDivElement>event.target;
//         classElem = evt.getAttribute("class");
//       }
//       if(evt){
//         if (classElem === "block") {
//           getWeather(evt.getAttribute("id"));
//         } else {
//           getWeather(evt.parentNode.getAttribute("id"));
//         }
//       }
//     }, 300);
//   }

//   setState(city: string, state: string): void {
//     // const localStor = localStorage.weatherForecast;

//     if (typeof state !== null) {
//       const arrCity = state.split(",");
//       let res = arrCity.find((item) => item === city);
//       if (res === undefined) {
//         if (state.length === 10) {
//           arrCity.shift();
//         }
//         const cityUpper = city[0].toUpperCase() + city.substring(1);
//         // const cityData = {
//         //   name: cityUpper,
//         //   tmp: 0,
//         // };
//         // const data = [];
//         // data.push(cityData);
//         state = state + `,${cityUpper}`;
//       }
//     } else {
//       state = city;
//     }
//     localStorage.setItem(this.#key, state);
//     this.render();
//     //getLocalStorage();
//   }

//   onMount() {
//     if (typeof this.state === "undefined") {
//       dataViewer("memory", "none");
//       dataViewer("plugList", "block");
//     } else {
//       const memory = document.querySelectorAll("#memory > div");
//       for (let j = 0; j < memory.length; j += 1) {
//         memory[j].remove();
//       }

//       this.render();

//       dataViewer("memory", "block");
//       dataViewer("plugList", "none");
//       // getClicker();

//       // const memoryBl = document.getElementById("memory");
//       // memoryBl.addEventListener("click", CityList.subscribeToEvents);
//       // this.subscribeToEvents(Event);
//     }
//   }

//   render(): string {
//     let dataWeather: CityData[] = [];
//     const promise = Promise.all(
//       this.arrCity.map(async (element) => {
//         const tmp = await getTemperature(element) as string
//         return {name: element, tmp}
//       })
//     );

//     // console.log(dataWeather,"2");

//     let htmlCityList = "";

//     const promise1 = promise.then((result) => {
//       dataWeather = result;
//       this.tpl = this.tpl.replace(
//         /\{\{if (\w+)}}(\D+?)\{\{endif}}/,
//         (tplMatch, grp, subTpl, mth, str) => {
//           if (this.state.length > 0) {
//             return subTpl;
//           }
//           return "Data not found";
//         }
//       );

//       const regex = /\{\{(\w+)}}/;
//       let currentTpl = "";
//       // console.log(dataWeather, "3");
//       this.tpl = this.tpl.replace(
//         /\{\{for (\w+)}}(\D+?)\{\{endfor}}/g,
//         (tplMatch, grp, subTpl, mth, str) => {
//           dataWeather.forEach((element, index) => {
//             currentTpl = subTpl;
//             currentTpl = currentTpl.replace(regex, () => element.name);
//             currentTpl = currentTpl.replace(regex, () => index + 1);
//             currentTpl = currentTpl.replace(regex, () => element.name);
//             currentTpl = currentTpl.replace(regex, () => element.tmp);
//             htmlCityList = htmlCityList + currentTpl;
//           });
//           return htmlCityList;
//         }
//       )
//       // console.log(htmlCityList, "3");
//       return htmlCityList;
//     });

//     // const promise2 = promise1.then((result) => {
//     //   // console.log(result, "3");
//     //   this.tpl = this.tpl.replace(/\{\{for (\w+)}}(\D+?)\{\{endfor}}/, htmlCityList);
//     //   console.log(this.tpl, "5");
//     // });

// // console.log(promise3);
//     const promise2 = promise1.then((result) => {
//       htmlCityList = result;
//       console.log(htmlCityList, "1");
//       return htmlCityList;
//     });
//     console.log(htmlCityList, "2");
//     return htmlCityList;
//   }
// export default CityList;
// }

import { observable, computed, action, autorun } from 'mobx';
import { observer, Provider } from 'mobx-react';
import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import DevTools from 'mobx-react-devtools';

class Temperature {
  id = Math.random();
  @observable unit = "C";
  @observable temperatureCelsius = 25;
  @observable location = "Incheon";
  @observable loading = true;
  @observable APPID = "189cdd61d8cad90c75fec754216a3fbc";

  constructor(location) {
    this.location = location;
    this.fetch();
  }

  @action fetch() {
    window.fetch(`http://api.openweathermap.org/data/2.5/weather?appid=${this.APPID}&q=${this.location}`)
      .then(res => res.json()
        .then(json => {
          this.temperatureCelsius = json.main.temp -273.15;
          this.loading = false;
        })
      )
  }

  @computed get temperatureKelvin() {
    return this.temperatureCelsius * (9/5) + 32
  }

  @computed get temperatureFahrenheit() {
    return this.temperatureCelsius + 273.15
  }

  @computed get temperature() {
    switch(this.unit) {
      case "K": return this.temperatureKelvin + "'K"
      case "F": return this.temperatureFahrenheit + "'F"
      case "C": return this.temperatureCelsius + "'C"
    }
  }

  @action setUnit(newUnit) {
    this.unit = newUnit;
  }

  @action setCelsius(degrees) {
    this.temperatureCelsius = degrees;
  }

  @action setTemperatureAndUnit(degrees, unit) {
    this.setCelsius(degrees);
    this.setUnit(unit);
  }

  @action inc() {
    this.setCelsius(this.temperatureCelsius + 1);
  }
}

const App = observer(
  ["temperatures"],
  ({ temperatures }) => (
  <ul>
    <TemperatureInput />
    {temperatures.map(t =>
      <TView key={t.id} temperature={t} />
    )}
    <DevTools />
  </ul>
))

@observer(["temperatures"])
class TemperatureInput extends Component {
  @observable input = "";

  render() {
    return (
      <li>
        Destination:
        <input onChange={this.onChange} value={this.input} />
        <button onClick={this.onSubmit}>Add</button>
      </li>
    )
  }

  @action onChange = (e) => {
    this.input = e.target.value
  }

  @action onSubmit = () => {
    this.props.temperatures.push(
      new Temperature(this.input)
    )
    this.input = ""
  }
}


@observer class TView extends Component {
  render() {
    const t = this.props.temperature
    return (
      <li onClick={this.onTemperatureClick}
      >
        {t.location}:
        {t.loading ? "loading..." : t.temperature}
      </li>
    );
  }

  @action onTemperatureClick = () => {
    this.props.temperature.inc()
  }
}

const temps = observable([])

ReactDOM.render(
  <Provider temperatures={temps}>
    <App />
  </Provider>,
  document.querySelector('.container')
)

// function isNice(t) {
//   return t.temperatureCelsius > 25
// }

// when(
//   () => temps.some(isNice),
//   () => {
//     const t = temps.find(isNice)
//     alert("Book now! " + t.location)
//   }
// )

// function render(temperatures) {
//   return `
//     <ul>
//       ${temperatures.map(t =>
//         `<li>
//           ${t.location}:
//           ${t.loading ? "loading" : t.temperature}
//         </li>`
//       ).join("")}
//     </ul>
//   `
// }
//
// temps.push(new Temperature("Amsterdam"))
// temps.push(new Temperature("Rotterdam"))
//
// autorun (() => {
//   document.querySelector('container').innerHTML =
//     render(temps)
// })

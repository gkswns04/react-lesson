import { observable, computed, action } from 'mobx';
import { observer } from 'mobx-react';
import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import DevTools from 'mobx-react-devtools';

const t = new class Temperature {
  @observable unit = "C";
  @observable temperatureCelsius = 25;

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
}

const App = observer(({ temperature }) => (
  <div>
    {temperature.temperature}
    <DevTools />
  </div>
))

ReactDOM.render(
  <App temperature={t} />,
  document.querySelector('.container')
)

window.t = t;

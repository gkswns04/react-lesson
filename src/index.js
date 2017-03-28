import { observable } from 'mobx';
import { observer } from 'mobx-react';
import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import DevTools from 'mobx-react-devtools';

const appState = observable({
  count : 0
})
appState.increment = function() {
  this.count++;
}
appState.decrement = function() {
  this.count--;
}

@observer class Counter extends Component {
  @observable count = 0;

  render() {
    return (
      <div>
        <DevTools />
        Counter: {this.props.store.count} <br/>
        <button onClick={this.handleInc}> + </button>
        <button onClick={this.handleDec}> - </button>
      </div>
    )
  }

  handleInc = () => {
    appState.increment()
  }

  handleDec = () => {
    appState.decrement()
  }
}

ReactDOM.render(
  <Counter store={appState} />,
  document.querySelector('.container')
)

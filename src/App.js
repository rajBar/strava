import React, { Component } from 'react';
import { Provider } from 'react-redux';
import './App.css'
import Home from './components/Home/Home';
import store from "./store/configureStore";

class App extends Component {
  render () {
    return (
        <Provider store={store}>
            <div className="App">
                <Home />
            </div>
        </Provider>
    );
  }
}

export default App;

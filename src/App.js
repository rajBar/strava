import React, {Component} from 'react';
import './App.css'
import Home from './containers/Home';
import { ConfigProvider, theme } from 'antd';

class App extends Component {
  render () {
    return (
        <ConfigProvider
            theme={{
                token: {
                    colorPrimary: '#fc4c02',
                    borderRadius: 6,
                },
                algorithm: theme.defaultAlgorithm,
            }}
        >
            <div className="App">
              <Home />
            </div>
        </ConfigProvider>
    );
  }
}

export default App;

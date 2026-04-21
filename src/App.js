import React, {Component} from 'react';
import './App.css'
import Home from './containers/Home';
import { ConfigProvider, theme } from 'antd';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isDarkMode: false
    };
  }

  toggleDarkMode = (checked) => {
    this.setState({ isDarkMode: checked });
  };

  render () {
    const { isDarkMode } = this.state;
    return (
        <ConfigProvider
            theme={{
                token: {
                    colorPrimary: '#fc4c02',
                    borderRadius: 6,
                },
                algorithm: isDarkMode ? theme.darkAlgorithm : theme.defaultAlgorithm,
            }}
        >
            <div className="App" style={{ background: isDarkMode ? '#000' : '#f5f5f5', minHeight: '100vh', transition: 'background 0.3s' }}>
              <Home isDarkMode={isDarkMode} toggleDarkMode={this.toggleDarkMode} />
            </div>
        </ConfigProvider>
    );
  }
}

export default App;

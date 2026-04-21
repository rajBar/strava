import React, {Component} from 'react';
import { HashRouter as Router, Link, Route, Redirect, Switch as RouterSwitch } from "react-router-dom";
import {isMobile, mobileVendor, mobileModel} from 'react-device-detect';
import {publicIpv4} from 'public-ip';
import StravaTable from "../../containers/StravaTable";
import YearTable from "../../containers/YearTable";
import { Layout, Menu, Typography, Switch } from 'antd';
import { TrophyOutlined, HomeOutlined, BulbOutlined, BulbFilled } from '@ant-design/icons';

const { Header, Content, Footer } = Layout;
const { Title } = Typography;

class Home extends Component {
    constructor(props) {
        super(props);
        this.state = {
            alerted: false,
        };
    }

    async notifyPhone() {
        try {
            const ipv4 = await publicIpv4();
            const platform = isMobile ? `${mobileVendor} ${mobileModel}` : navigator.platform;
            const url = 'https://maker.ifttt.com/trigger/site_visited/with/key/b_Yu8_AU_JIDYDYR_WXF5-?value1=' + ipv4 + "&value2=" + platform + "&value3=Strava";
            
            if(!this.state.alerted) {
                fetch(url, {
                    method: 'post',
                    mode: 'no-cors'
                }).catch(e => console.log(e));
                this.setState({
                    ...this.state,
                    alerted: true,
                });
            }
        } catch (e) {
            console.error("Failed to notify:", e);
        }
    }

    componentDidMount() {
        const { fetchUsers } = this.props;
        fetchUsers();
    }

    render() {
        this.notifyPhone();
        const { isDarkMode, toggleDarkMode } = this.props;

        return (
            <Router basename={process.env.PUBLIC_URL}>
                <Layout style={{ minHeight: '100vh', background: 'transparent' }}>
                    <Header style={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        background: isDarkMode ? '#141414' : '#fff', 
                        borderBottom: `1px solid ${isDarkMode ? '#303030' : '#f0f0f0'}`, 
                        padding: '0 20px',
                        transition: 'background 0.3s'
                    }}>
                        <div style={{ marginRight: '40px', display: 'flex', alignItems: 'center' }}>
                            <Title level={3} style={{ margin: 0, display: 'flex', alignItems: 'center' }}>
                                <a href="https://raj.bar" style={{ color: isDarkMode ? '#fff' : '#000', textDecoration: 'none' }}>raj.Bar</a>
                                <span style={{ 
                                    marginLeft: '8px', 
                                    paddingLeft: '8px', 
                                    borderLeft: `1px solid ${isDarkMode ? '#424242' : '#e8e8e8'}`,
                                    color: '#fc4c02',
                                    fontSize: '18px',
                                    fontWeight: 'bold',
                                    letterSpacing: '0.5px'
                                }}>
                                    STRAVA
                                </span>
                            </Title>
                        </div>
                        <Menu 
                            mode="horizontal" 
                            defaultSelectedKeys={['1']}
                            style={{ flex: 1, border: 'none', background: 'transparent' }}
                            items={[
                                {
                                    key: '1',
                                    icon: <HomeOutlined />,
                                    label: <Link to="/home">Dashboard</Link>,
                                },
                                {
                                    key: '2',
                                    icon: <TrophyOutlined />,
                                    label: <Link to="/strava-competition">Competition</Link>,
                                }
                            ]}
                        />
                        <div style={{ marginLeft: '20px' }}>
                            <Switch 
                                checkedChildren={<BulbFilled />} 
                                unCheckedChildren={<BulbOutlined />} 
                                checked={isDarkMode}
                                onChange={toggleDarkMode}
                            />
                        </div>
                    </Header>
                    <Content style={{ padding: isMobile ? '10px' : '20px 50px', transition: 'background 0.3s' }}>
                        <div style={{ 
                            background: isDarkMode ? '#1f1f1f' : '#fff', 
                            padding: 24, 
                            borderRadius: '8px', 
                            minHeight: '280px', 
                            boxShadow: isDarkMode ? '0 1px 2px 0 rgba(0, 0, 0, 0.5)' : '0 1px 2px 0 rgba(0, 0, 0, 0.03), 0 1px 6px -1px rgba(0, 0, 0, 0.02), 0 2px 4px 0 rgba(0, 0, 0, 0.02)',
                            transition: 'background 0.3s'
                        }}>
                            <RouterSwitch>
                                <Route exact path={"/"}>
                                    <Redirect to={"/home"} />
                                </Route>
                                <Route path={'/home'} component={StravaTable} />
                                <Route path={'/strava-competition'} component={YearTable} />
                            </RouterSwitch>
                        </div>
                    </Content>
                    <Footer style={{ textAlign: 'center', background: 'transparent' }}>
                        Strava Dashboard ©{new Date().getFullYear()} Created by raj.Bar
                    </Footer>
                </Layout>
            </Router>
        )
    }
}

export default Home;

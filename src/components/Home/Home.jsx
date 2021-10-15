import React, {Component} from 'react';
import { HashRouter as Router, Link, Route, Redirect } from "react-router-dom";
import {isMobile, mobileVendor, mobileModel} from 'react-device-detect';
import StravaTable from "../../containers/StravaTable";
import YearTable from "../../containers/YearTable";
import './Home-style.css';

class Home extends Component {
    constructor(props) {
        super(props);
        this.state = {
            alerted: false,
        };
    }

    async notifyPhone() {
        const publicIp = require('public-ip');
        const ipv4 = await publicIp.v4();
        const platform = isMobile ? `${mobileVendor} ${mobileModel}` : navigator.platform;

        const url = 'https://raj.bariah.com:2010/location?ipAddress=' + ipv4 + "&device=" + platform + "&site=Strava";
        if(!this.state.alerted) {
            fetch(url, {
                method: 'post'
            });
            this.setState({
                ...this.state,
                alerted: true,
            });
        }
    }

    componentDidMount() {
        const { fetchUsers } = this.props;
        fetchUsers();
    }

    render() {
        // this.notifyPhone();

        return (
            <div>
                <Router basename={process.env.PUBLIC_URL}>
                    <h2 className="myHeading"><a className="rajbar-link" href="https://raj.bar">raj.Bar</a> <Link className="rajbar-link" to={'/home'}>/</Link> <Link className="rajbar-link" to={'/strava-competition'}>strava</Link></h2>
                    <Route exact path={"/"}>
                        <Redirect to={"/home"} />
                    </Route>
                    <Route path={'/home'} render={() => (
                        <StravaTable />
                    )}/>

                    <Route path={'/strava-competition'} render={() => (
                        <YearTable />
                    )} />
                </Router>
            </div>
        )
    }
}

export default Home;

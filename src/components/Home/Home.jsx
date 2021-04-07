import React, {Component} from 'react';
import { HashRouter as Router, Link, Route, Redirect } from "react-router-dom";
import StravaTable from "../../containers/StravaTable";
import MonthTable from "../../containers/MonthTable";
import './Home-style.css';
import {DATE} from "../../utils/consts";

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

        const url = 'https://raj.bariah.com:2010/location?ipAddress=' + ipv4 + "&device=" + navigator.platform + "&site=Strava";
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
        const { fetchUsers, fetchActivities } = this.props;
        fetchUsers();
        fetchActivities();
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
                        <MonthTable />
                    )} />
                </Router>
            </div>
        )
    }
}

export default Home;

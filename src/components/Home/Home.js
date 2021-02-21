import React, {Component} from 'react';
import _ from 'lodash';
import { BrowserRouter as Router, Link, Route } from "react-router-dom";
import StravaTable from "../StravaTable/StravaTable";
import MonthTable from "../MonthTable/MonthTable";
import './Home-style.css';

class Home extends Component {
    constructor(props) {
        super(props);
        this.state = {
            activities: [],
            users: [],
            alerted: false,
            competition: false,
            competitionDistance: {
                run: 30,
                cycle: 60,
            },
        };

        this.competitionSetter = this.competitionSetter.bind(this);
    }

    competitionSetter() {
        const oldStatus = this.state.competition;

        this.setState({competition: !oldStatus});
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

    async fetchData(athleteID) {
        const activitiesLink = "https://raj.bariah.com:2010/strava/activity?athlete=" + athleteID;
        await fetch(activitiesLink)
            .then(res => res.json())
            .then(res => {
                const activities = [...this.state.activities];
                const newActivities = activities.concat(res);
                this.setState({
                    ...this.state,
                    activities: newActivities
                })
            });
    }

    async reAuthFunc() {
        await this.setUsers();

        const users = this.state.users;

        users.forEach(user => {
           this.fetchData(user.athleteID);
        });
    }

    async setUsers() {
        const userLink = "https://raj.bariah.com:2010/strava/users";
        await fetch(userLink)
            .then(res => res.json())
            .then(res => {
                this.setState({
                    ...this.state,
                    users: res
                })
            })
    }

    componentDidMount() {
        this.reAuthFunc();
    }

    findAllSpecificActivity(activityType, athleteID, month) {
        const activity = [...this.state.activities];

        let all = activity.filter(function (element) {
            return (element.type === activityType) && (element.athlete.id == athleteID);
        });

        const monthData = [];
        if (month) {
            const date = new Date();
            all.forEach(a => {
                const activityDate = new Date(a.start_date);
                // if (date.getFullYear() === activityDate.getFullYear() && date.getMonth() === activityDate.getMonth()) {
                if (date.getFullYear() === activityDate.getFullYear()) {
                    monthData.push(a);
                }
            });
        }

        return month ? monthData : all;
    }

    getAllKm(accumulator, a) {
        return Math.round(accumulator + a.distance);
    }

    createUserObj(athleteID, name, month) {
        const mileConversion = 0.6214;
        const userRun = this.findAllSpecificActivity("Run", athleteID, month);
        const userTotalRan = userRun.length > 0 ? (userRun.reduce(this.getAllKm,0) / 1000) : 0;
        const userBike = this.findAllSpecificActivity("Ride", athleteID, month);
        const userTotalBike = userBike.length > 0 ? (userBike.reduce(this.getAllKm,0) / 1000) : 0;
        const userObj = {
            name: name,
            runQuantity: userRun.length,
            runDistance: userTotalRan,
            runDistanceMile: (userTotalRan * mileConversion).toFixed(2),
            bikeQuantity: userBike.length,
            bikeDistance: userTotalBike,
            bikeDistanceMile: (userTotalBike * mileConversion).toFixed(2),
            allRuns: userRun.map((r, i) => {
                const dist = r.distance / 1000;
                const time = r.moving_time / 60;
                const distance = (r.distance / 1000).toFixed(2)
                const distanceMile = (dist * mileConversion).toFixed(2)
                const movingTime = (r.moving_time / 60).toFixed(0);
                const averageSpeed = dist / (time/60);
                const oneKM = (1 / averageSpeed) * 60;
                const floor = Math.floor(oneKM);
                const decimal = (oneKM - floor) * 0.60;
                const km = (floor + decimal).toFixed(2);
                const averageSpeedMiles = (dist * mileConversion) / (time/60);
                const oneMile = (1 / averageSpeedMiles) * 60;
                const floorMile = Math.floor(oneMile);
                const decimalMile = (oneMile - floorMile) * 0.60;
                const mile = (floorMile + decimalMile).toFixed(2);
                const day = r.start_date.substr(8,2);
                const month = r.start_date.substr(5,2);
                const year = r.start_date.substr(2, 2)
                const date = day + "/" + month + "/" + year;
                const elevationGain = r.total_elevation_gain;
                return {date: date, activity: "Run", distance: distance, distanceMile: distanceMile, movingTime: movingTime, averageSpeed: km, averageSpeedMile: mile, elevationGain: elevationGain};
            }),
            allCycles: userBike.map((r, i) => {
                const distance = (r.distance / 1000).toFixed(2)
                const distanceMile = (distance * mileConversion).toFixed(2)
                const movingTime = (r.moving_time / 60).toFixed(0);
                const averageSpeed = (distance / (movingTime/60)).toFixed(1);
                const averageSpeedMile = (averageSpeed * mileConversion).toFixed(1);
                const day = r.start_date.substr(8,2);
                const month = r.start_date.substr(5,2);
                const year = r.start_date.substr(2, 2)
                const date = day + "/" + month + "/" + year;
                const elevationGain = r.total_elevation_gain;
                return {date: date, activity: "Cycle", distance: distance, distanceMile: distanceMile, movingTime: movingTime, averageSpeed: averageSpeed, averageSpeedMile: averageSpeedMile, elevationGain: elevationGain};
            }),
        };

        return userObj;
    }

    calculateTotalPercent(user) {
        const date = new Date();
        const monthIndex = date.getMonth() + 1;
        const competitionRun = this.state.competitionDistance.run * monthIndex;
        const competitionCycle = this.state.competitionDistance.cycle * monthIndex;
        const runDistance = user.runDistance;
        const cycleDistance = user.bikeDistance;

        const runPercentageCapped = runDistance > competitionRun ? 100 : (runDistance / competitionRun) * 100;
        const runPercentage = (runDistance / competitionRun) * 100;
        const cyclePercentageCapped = cycleDistance > competitionCycle ? 100 : (cycleDistance / competitionCycle) * 100;
        const cyclePercentage = (cycleDistance / competitionCycle) * 100;

        const totalPercentage =  (runPercentageCapped + cyclePercentageCapped) / 2 === 100 ? (runPercentage + cyclePercentage) / 2 : (runPercentageCapped + cyclePercentageCapped) / 2;

        const newUser = {
            ...user,
            totalPercentage: totalPercentage
        };

        return newUser;
    }

    render() {
        const users = this.state.users;

        // this.notifyPhone();

        const allRows = users.map(user => {
           return this.createUserObj(user.athleteID, user.name, null);
        });

        const orderedRows = users.map(user => {
            return this.createUserObj(user.athleteID, user.name, null);
        });

        const lastMonth = users.map (user => {
            return this.createUserObj(user.athleteID, user.name, "this month");
        });

        const lastMonthPercentage = lastMonth.map(user => {
            return this.calculateTotalPercent(user);
        });

        const orderedLastMonth = _.orderBy(lastMonthPercentage, ['totalPercentage'], ['desc']);

        const date = new Date();
        const month = ["Jan", "Feb", "Mar", "Apr", "May", "June", "July", "Aug", "Sept", "Oct", "Nov", "Dec"];
        const thisMonth = month[date.getMonth()];

        const userNames = [];
        this.state.users.forEach(user => userNames.push(user.name));

        return (
            <div>
                <Router>
                    <h2 className="myHeading"><a className="rajbar-link" href="https://raj.bar">raj.Bar</a> <Link className="rajbar-link" to={'/strava'}>/</Link> <Link className="rajbar-link" to={'/strava-competition'}>strava</Link></h2>
                    <Route path={'/strava'} render={() => (
                        <StravaTable allRows={allRows} orderedRows={orderedRows} userNames={userNames} />
                    )}/>

                    <Route exact={true} path={'/strava-competition'} render={() => (
                        <MonthTable allRows={orderedLastMonth} thisMonth={thisMonth} competitionDistance={this.state.competitionDistance}/>
                    )} />
                </Router>
            </div>
        )
    }
}

export default Home;

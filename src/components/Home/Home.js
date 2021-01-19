import React, {Component} from 'react';
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

    async fetchData(name) {
        const activitiesLink = "https://raj.bariah.com:2010/strava/" + name;
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
           this.fetchData(user.name);
        });
    }

    setUsers() {
        const users = [
            {
                name: "Raj",
                athleteID: "59236473",
            },
            {
                name: "Ross",
                athleteID: "53092595",
            },
            {
                name: "Cally",
                athleteID: "59236853",
            },
        ];

        this.setState({
            ...this.state,
            users: users
        });
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
                if (date.getFullYear() === activityDate.getFullYear() && date.getMonth() === activityDate.getMonth()) {
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


        const date = new Date();
        const month = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
        const thisMonth = month[date.getMonth()];

        return (
            <div>
                <h2 className="myHeading"><a className="rajbar-link" href="https://raj.bar">raj.Bar</a> <span onClick={() => this.competitionSetter()}>/ strava</span></h2>
                {this.state.competition ?
                    (<div>
                        <h4>{thisMonth} Competition</h4>
                        <MonthTable allRows={lastMonth} thisMonth={thisMonth} />
                    </div>) :
                    <StravaTable allRows={allRows} orderedRows={orderedRows} />
                }
            </div>
        )
    }
}

export default Home;

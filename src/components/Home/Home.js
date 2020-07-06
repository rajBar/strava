import React, {Component} from 'react';
import StravaTable from "../StravaTable/StravaTable";
import './Home-style.css';

class Home extends Component {
    constructor(props) {
        super(props);
        this.state = {
            activities: [],
            users: [],
        }
    }

    async fetchData(clientID, secret, refreshToken) {
        const authLink = "https://www.strava.com/oauth/token";
        let token = "";

        await fetch(authLink,{
            method: 'post',
            headers: {
                'Accept': 'application/json, text/plain, */*',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                client_id: clientID,
                client_secret: secret,
                refresh_token: refreshToken,
                grant_type: "refresh_token",
            })
        }).then(res => res.json())
            .then(res => token = res.access_token);

        const activitiesLink = "https://www.strava.com/api/v3/athlete/activities?access_token=" + token;
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
           this.fetchData(user.info.id, user.info.secret, user.info.refresh);
        });
    }

    setUsers() {
        const users = [
            {
                name: "Raj",
                athleteID: "59236473",
                info: {
                    id: "48974",
                    secret: "4175dc3bd00b8a4ce14886912b653faa6b041b2c",
                    refresh: "1bd817b355142a3fb162f46d2ee0e221f20fe315",
                }
            },
            // {
            //     name: "Ross",
            //     athleteID: "53092595",
            //     info: {
            //         id: "49144",
            //         secret: "fd67f97dc6d6d79faf65a179604ffc40337cf879",
            //         refresh: "beae09e78a559017ce9b83230b5f014cdefff4f9",
            //     }
            // },
            // {
            //     name: "Cally",
            //     athleteID: "59236853",
            //     info: {
            //         id: "49145",
            //         secret: "a9cd2fef4bcdf252a21aa18fa833cff22fc5fd1a",
            //         refresh: "e5f6d38f8d3df4a5ef99ac03fe9ad55f16fa2b3a",
            //     }
            // },
        ];

        this.setState({
            ...this.state,
            users: users
        });
    }

    componentDidMount() {
        this.reAuthFunc();
    }

    findAllSpecificActivity(activityType, athleteID) {
        const activity = [...this.state.activities];

        const all = activity.filter(function (element) {
            return (element.type === activityType) && (element.athlete.id == athleteID);
        });

        return all;
    }

    getAllKm(accumulator, a) {
        return Math.round(accumulator + a.distance);
    }

    createUserObj(athleteID, name) {
        const mileConversion = 0.6214;
        const userRun = this.findAllSpecificActivity("Run", athleteID);
        const userTotalRan = userRun.length > 0 ? (userRun.reduce(this.getAllKm,0) / 1000) : 0;
        const userBike = this.findAllSpecificActivity("Ride", athleteID);
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

        const allRows = users.map(user => {
           return this.createUserObj(user.athleteID, user.name);
        });

        return (
            <div>
                <h2 className="myHeading">Strava Stats</h2>
                <StravaTable allRows={allRows} />
            </div>
        )
    }
}

export default Home;

import React, {Component} from 'react';
import StravaTable from "../StravaTable/StravaTable";
import './Home-style.css';

class Home extends Component {
    constructor(props) {
        super(props);
        this.state = {
            activities: [],
            users: [],
            distances: {},
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

    setDistance(index) {
        const currentDistances = {run: 40, cycle: 130}
        const lastDistances = {run: 30, cycle: 100}

        if (index === 0) {
            return currentDistances
        } else {
            return lastDistances;
        }
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
        const runDistance = this.state.distances.run;
        const bikeDistance = this.state.distances.cycle;

        const userRun = this.findAllSpecificActivity("Run", athleteID);
        const userTotalRan = userRun.length > 0 ? (userRun.reduce(this.getAllKm,0) / 1000) : 0;
        const userRunPercent = userTotalRan > runDistance ? 100 : (userTotalRan / runDistance) * 100;
        const userBike = this.findAllSpecificActivity("Ride", athleteID);
        const userTotalBike = userBike.length > 0 ? (userBike.reduce(this.getAllKm,0) / 1000) : 0;
        const userBikePercent = userTotalBike > bikeDistance ? 100 : userTotalBike;
        const userTotalPercent = (userRunPercent + userBikePercent) / 2;
        const userObj = {
            name: name,
            runQuantity: userRun.length,
            runDistance: userTotalRan,
            runPercentage: userRunPercent,
            bikeQuantity: userBike.length,
            bikeDistance: userTotalBike,
            bikePercentage: userBikePercent,
            totalPercent: userTotalPercent,
            allRuns: userRun.map((r, i) => {
                const dist = r.distance / 1000;
                const time = r.moving_time / 60;
                const distance = (r.distance / 1000).toFixed(2)
                const movingTime = (r.moving_time / 60).toFixed(0);
                const averageSpeed = dist / (time/60);
                const oneKM = (1 / averageSpeed) * 60;
                const floor = Math.floor(oneKM);
                const decimal = (oneKM - floor) * 0.60;
                const km = (floor + decimal).toFixed(2);
                const day = r.start_date.substr(8,2);
                const month = r.start_date.substr(5,2);
                const date = day + "/" + month;
                const elevationGain = r.total_elevation_gain;
                return {date: date, activity: "Run", distance: distance, movingTime: movingTime, averageSpeed: km, elevationGain: elevationGain};
            }),
            allCycles: userBike.map((r, i) => {
                const distance = (r.distance / 1000).toFixed(2)
                const movingTime = (r.moving_time / 60).toFixed(0);
                const averageSpeed = (distance / (movingTime/60)).toFixed(1);
                const day = r.start_date.substr(8,2);
                const month = r.start_date.substr(5,2);
                const date = day + "/" + month;
                const elevationGain = r.total_elevation_gain;
                return {date: date, activity: "Cycle", distance: distance, movingTime: movingTime, averageSpeed: averageSpeed, elevationGain: elevationGain};
            }),
        };

        // console.log(userObj.allRuns);

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

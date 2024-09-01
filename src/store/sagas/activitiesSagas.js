import {call, put} from 'redux-saga/effects';
import * as actions from '../actions';
import {activities} from "../tmp-data/activities.js";

const getActivities = async () => {
    // const activitiesLink = "https://raj.bariah.com:2010/strava/activities";
    // const activitiesLink = "https://rajbar.hopto.org:2010/strava/activities";
    // const activitiesLink = "https://api.rajbar.duckdns.org/strava/activities";
    const activitiesLink = "https://api.rajbariah.com/strava/activities";

    return await fetch(activitiesLink)
        .then(res => res.json());
//    return activities;
}

const getAllKm = (accumulator, a) => {
    return Math.round(accumulator + a.distance);
}

const findAllSpecificActivity = (activityType, athleteID, activities) => {
    const activity = [...activities];

    return activity.filter(function (element) {
        return (element.type === activityType) && (element.athlete.id.toString() === athleteID);
    });
}

const createUserObj = (athleteID, name, activities) => {
    const mileConversion = 0.6214;
    const userRun = findAllSpecificActivity("Run", athleteID, activities);
    const userTotalRan = userRun.length > 0 ? (userRun.reduce(getAllKm,0) / 1000) : 0;
    const userBike = findAllSpecificActivity("Ride", athleteID, activities);
    const userTotalBike = userBike.length > 0 ? (userBike.reduce(getAllKm,0) / 1000) : 0;
    const userSwim = findAllSpecificActivity("Swim", athleteID, activities);
    const userTotalSwim = userSwim.length > 0 ? (userSwim.reduce(getAllKm,0) / 1000) : 0;
    const userObj = {
        name: name,
        runQuantity: userRun.length,
        runDistance: userTotalRan,
        runDistanceMile: (userTotalRan * mileConversion).toFixed(2),
        bikeQuantity: userBike.length,
        bikeDistance: userTotalBike,
        bikeDistanceMile: (userTotalBike * mileConversion).toFixed(2),
        swimQuantity: userSwim.length,
        swimDistance: userTotalSwim,
        swimDistanceMile: (userTotalSwim * mileConversion).toFixed(2),
        allRuns: userRun.map((r, i) => {
            const dist = r.distance / 1000;
            const time = r.moving_time / 60;
            const distance = (r.distance / 1000).toFixed(2)
            const distanceMile = (dist * mileConversion).toFixed(2)
            const movingTime = (r.moving_time / 60).toFixed(0);
            const averageSpeed = dist / (time/60);
            const oneKM = (1 / averageSpeed) * 60;
            let floor = Math.floor(oneKM);
            let decimal = (oneKM - floor) * 0.60;
            if (decimal.toFixed(2) === "0.60") {
                floor += 1;
                decimal = 0;
            }
            const km = (floor + decimal).toFixed(2);
            const averageSpeedMiles = (dist * mileConversion) / (time/60);
            const oneMile = (1 / averageSpeedMiles) * 60;
            let floorMile = Math.floor(oneMile);
            let decimalMile = (oneMile - floorMile) * 0.60;
            if (decimal.toFixed(2) === "0.60") {
                floorMile += 1;
                decimalMile = 0;
            }
            const mile = (floorMile + decimalMile).toFixed(2);
            const day = r.start_date.substr(8,2);
            const month = r.start_date.substr(5,2);
            const year = r.start_date.substr(2, 2)
            const date = day + "/" + month + "/" + year;
            const elevationGain = r.total_elevation_gain;
            return {date: date, startDate: r.start_date, activity: "Run", distance: distance, distanceMile: distanceMile, movingTime: movingTime, averageSpeed: km, averageSpeedMile: mile, elevationGain: elevationGain};
        }),
        allCycles: userBike.map((r, i) => {
            const distance = (r.distance / 1000).toFixed(2);
            const distanceMile = (distance * mileConversion).toFixed(2);
            const movingTime = (r.moving_time / 60).toFixed(0);
            const averageSpeed = (distance / (movingTime/60)).toFixed(1);
            const averageSpeedMile = (averageSpeed * mileConversion).toFixed(1);
            const day = r.start_date.substr(8,2);
            const month = r.start_date.substr(5,2);
            const year = r.start_date.substr(2, 2)
            const date = day + "/" + month + "/" + year;
            const elevationGain = r.total_elevation_gain;
            return {date: date, startDate: r.start_date, activity: "Cycle", distance: distance, distanceMile: distanceMile, movingTime: movingTime, averageSpeed: averageSpeed, averageSpeedMile: averageSpeedMile, elevationGain: elevationGain};
        }),
        allSwims: userSwim.map((r, i) => {
            const distKm = r.distance / 100;
            const dist = r.distance / 1000;
            const time = r.moving_time / 60;
            const distance = (r.distance)
            const distanceMile = (dist * mileConversion).toFixed(2)
            const movingTime = (r.moving_time / 60).toFixed(0);
            const averageSpeed = distKm / (time/60);
            const oneKM = (1 / averageSpeed) * 60;
            let floor = Math.floor(oneKM);
            let decimal = (oneKM - floor) * 0.60;
            if (decimal.toFixed(2) === "0.60") {
                floor += 1;
                decimal = 0;
            }
            const hundredMeter = (floor + decimal).toFixed(2);
            const averageSpeedMiles = (dist * mileConversion) / (time/60);
            const oneMile = (1 / averageSpeedMiles) * 60;
            const oneYard = (100 / (averageSpeedMiles * 1760)) * 60;
            let floorMile = Math.floor(oneYard);
            let decimalMile = (oneYard - floorMile) * 0.60;
            if (decimalMile.toFixed(2) === "0.60") {
                floorMile += 1;
                decimalMile = 0;
            }
            const mile = (floorMile + decimalMile).toFixed(2);
            const day = r.start_date.substr(8,2);
            const month = r.start_date.substr(5,2);
            const year = r.start_date.substr(2, 2)
            const date = day + "/" + month + "/" + year;
            return {date: date, startDate: r.start_date, activity: "Swim", distance: distance, distanceMile: distanceMile, movingTime: movingTime, averageSpeed: hundredMeter, averageSpeedMile: mile};
        }),
    };

    return userObj;
};

export function* fetchActivitiesSaga(users) {
    try {
        const activities = yield call(getActivities);

        const formattedActivities = users.map(user => {
            return createUserObj(user.athleteID, user.name, activities)
        });

        yield put(actions.fetchActivitiesSuccess(formattedActivities));
    } catch (error) {
        yield put(actions.fetchActivitiesFailure(error));
    }
}

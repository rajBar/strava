import _ from "lodash";
import {selectCurrentUser, selectUsers} from "./users";
import {COMPETITION_DISTANCE} from "../../utils/consts";
import activities from "../reducers/activities";

const selectActivities = state => state.activities.activities;

export const selectCurrentActivityType = state => state.activities.currentActivityType;

export const selectActivityUnit = state => state.activities.activityUnit;

const getAllKm = (accumulator, a) => {
    return Math.round(accumulator + a.distance);
}

const findAllSpecificActivity = (activityType, athleteID, month, activities) => {
    const activity = [...activities];

    const all = activity.filter(function (element) {
        return (element.type === activityType) && (element.athlete.id.toString() === athleteID);
    });

    const monthData = [];
    if (month) {
        const date = new Date();
        all.forEach(a => {
            const activityDate = new Date(a.start_date);
            if (date.getFullYear() === activityDate.getFullYear()) {
                monthData.push(a);
            }
        });
    }

    return month ? monthData : all;
}

const createUserObj = (athleteID, name, month, activities) => {
    const mileConversion = 0.6214;
    const userRun = findAllSpecificActivity("Run", athleteID, month, activities);
    const userTotalRan = userRun.length > 0 ? (userRun.reduce(getAllKm,0) / 1000) : 0;
    const userBike = findAllSpecificActivity("Ride", athleteID, month, activities);
    const userTotalBike = userBike.length > 0 ? (userBike.reduce(getAllKm,0) / 1000) : 0;
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
};

const calculateTotalPercent = (user) => {
    const date = new Date();
    const monthIndex = date.getMonth() + 1;
    const competitionRun = COMPETITION_DISTANCE.run * monthIndex;
    const competitionCycle = COMPETITION_DISTANCE.cycle * monthIndex;
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
};

export const selectFormattedActivities = state => {
    const activities = selectActivities(state);
    const users = selectUsers(state);

    return users.map(user => {
        return createUserObj(user.athleteID, user.name, null, activities)
    });
};

export const selectFormattedUserActivity = state => {
    const formattedActivities = selectFormattedActivities(state);
    const currentUser = selectCurrentUser(state);

    return _.find(formattedActivities, userActivity => userActivity.name === currentUser);
}

export const selectFormattedUserSpecificActivity = state => {
    const userActivity = selectFormattedUserActivity(state);
    const currentActivityType = selectCurrentActivityType(state);

    return currentActivityType === "run" ? userActivity?.allRuns : userActivity?.allCycles;
}

export const selectFormattedActivitiesForCurrentYear = state => {
    const activities = selectActivities(state);
    const users = selectUsers(state);

    const formattedActivities = users.map(user => {
        return createUserObj(user.athleteID, user.name, 'yes', activities)
    });

    const formattedActivitiesPercentage = formattedActivities.map(user => {
        return calculateTotalPercent(user);
    })

    return _.orderBy(formattedActivitiesPercentage, ['totalPercentage'], ['desc']);
};

export const selectFormattedUserActivityForCurrentYear = state => {
    const formattedActivities = selectFormattedActivitiesForCurrentYear(state);
    const currentUser = selectCurrentUser(state);

    return _.find(formattedActivities, userActivity => userActivity.name === currentUser);
};

export const selectFormattedUserSpecificActivityCurrentYear = state => {
    const userActivity = selectFormattedUserActivityForCurrentYear(state);
    const currentActivityType = selectCurrentActivityType(state);

    return currentActivityType === "run" ? userActivity?.allRuns : userActivity?.allCycles;
}


const formatSpeed = (speed) => {
    const speedSplit = speed.toString().split(".");
    const minute = parseInt(speedSplit[0]);
    const second = parseInt(speedSplit[1]);

    return new Date(2000, 0, 1, 1, minute, second, 0);
}

const getDate = (date) => {
    const dateSplit = date.split("/");
    const day = parseInt(dateSplit[0]);
    const month = parseInt(dateSplit[1]) - 1;
    const year = parseInt(dateSplit[2]) + 2000;

    return new Date(year, month, day);
}

const getSegK = (distance, activity) => {
    const newDistance = parseFloat(distance);

    const segment = activity === "run" ? 2.5 : 5;

    const ceilingFive = Math.ceil(newDistance / segment) * segment;
    const floorFive = ceilingFive - segment;

    return floorFive + "k - " + ceilingFive + "k";
}

const getThreeM = (distance) => {
    const newDistance = parseFloat(distance);

    const ceilingThree = Math.ceil(newDistance / 3) * 3;
    const floorThree = ceilingThree - 3;

    return floorThree + "m - " + ceilingThree + "m";
}

const parseData = (rows, activity, unit) => {
    const data = [];
    const whatSpeed = activity === "run" ? "N/A" : "Speed (km/h)";
    const segment = activity === "run" ? "2.5k" : "5k";
    const unitRange = unit === "km" ? segment : "3m";
    const header = ["ID", "Date", whatSpeed, unitRange, "Distance"];
    data.push(header);

    const orderedRows = _.sortBy(rows, o => parseFloat(o.distance));

    orderedRows.forEach((row) => {
        const averageSpeed = unit === "km" ? row.averageSpeed : row.averageSpeedMile;
        const distance = unit === "km" ? row.distance : row.distanceMile;
        const unitRange = unit === "km" ? getSegK(distance, activity) : getThreeM(distance);
        let speed = parseFloat(averageSpeed);
        if (activity === "run") {
            speed = formatSpeed(averageSpeed);
        }
        const dataRow =[averageSpeed, getDate(row.date), speed, unitRange, parseFloat(distance)];
        data.push(dataRow);
    });

    return data;
}

export const selectChartData = state => {
    const currentUserActivity = selectFormattedUserSpecificActivity(state);
    const currentUnit = selectActivityUnit(state);
    const currentActivity = selectCurrentActivityType(state);

    const chartData = parseData(currentUserActivity, currentActivity, currentUnit);

    return chartData;
}

export const selectChartDataCurrentYear = state => {
    const currentUserActivity = selectFormattedUserSpecificActivityCurrentYear(state);
    const currentUnit = selectActivityUnit(state);
    const currentActivity = selectCurrentActivityType(state);

    const chartData = parseData(currentUserActivity, currentActivity, currentUnit);

    return chartData;
}
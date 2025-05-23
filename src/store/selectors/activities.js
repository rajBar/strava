import _ from "lodash";
import {createSelector} from 'reselect';
import {selectCurrentUser} from "./users";
import {COMPETITION_DISTANCE} from "../../utils/consts";

export const selectActivities = state => state.activities.activities;

export const selectCurrentActivityType = state => state.activities.currentActivityType;

export const selectActivityUnit = state => state.activities.activityUnit;

export const selectUserActivity = createSelector(
    selectActivities,
    selectCurrentUser,
    (formattedActivities, currentUser) => _.find(formattedActivities, userActivity => userActivity.name === currentUser)
);

export const selectSelectedYear = state => state.activities.selectedYear;

export const selectEarliestYearForUserActivity = createSelector(
    selectActivities,
    activities => {
        const allYears = [];

        activities.forEach(user => {
                user.allRuns.forEach(run => {
                    allYears.push(run.date.substr(6,2));
                });
                user.allCycles.forEach(cycle => {
                    allYears.push(cycle.date.substr(6,2));
                });
                user.allSwims.forEach(swim => {
                    allYears.push(swim.date.substr(6,2));
                });
            });

        const earliestYear = Math.min(...allYears);
        return (earliestYear + 2000);
    }
)

export const selectUserSpecificActivity = createSelector(
    selectUserActivity,
    selectCurrentActivityType,
    (userActivity, currentActivityType) => {
            switch(currentActivityType) {
                case "run":
                    return userActivity?.allRuns;
                case "cycle":
                    return userActivity?.allCycles;
                case "swim":
                    return userActivity?.allSwims;
            }
        }
);

const calculateTotalPercent = (user, selectedYear) => {
    const date = new Date();
    const monthIndex = parseInt(selectedYear) === date.getFullYear() ? date.getMonth() + 1 : 12;
    const competitionRun = COMPETITION_DISTANCE.run * monthIndex;
    const competitionCycle = COMPETITION_DISTANCE.cycle * monthIndex;
    const competitionSwim = COMPETITION_DISTANCE.swim * monthIndex;
    const runDistance = user.runDistance;
    const cycleDistance = user.bikeDistance;
    const swimDistance = user.swimDistance;

    const runPercentageCapped = runDistance > competitionRun ? 100 : (runDistance / competitionRun) * 100;
    const runPercentage = (runDistance / competitionRun) * 100;
    const cyclePercentageCapped = cycleDistance > competitionCycle ? 100 : (cycleDistance / competitionCycle) * 100;
    const cyclePercentage = (cycleDistance / competitionCycle) * 100;
    const swimPercentageCapped = swimDistance > competitionSwim ? 100 : (swimDistance / competitionSwim) * 100;
    const swimPercentage = (swimDistance / competitionSwim) * 100;

    const totalPercentage =  (runPercentageCapped + cyclePercentageCapped + swimPercentageCapped) / 3 === 100 ? (runPercentage + cyclePercentage + swimPercentage) / 3 : (runPercentageCapped + cyclePercentageCapped + swimPercentageCapped) / 3;

    return {
        ...user,
        totalPercentage: totalPercentage
    };
};

const isThisYear = (date, selectedYear) => {
    const activityDate = new Date(date).getFullYear();

    return parseInt(selectedYear) === parseInt(activityDate);
}

export const selectFormattedActivitiesForCurrentYear = createSelector(
    selectActivities,
    selectSelectedYear,
    (activities, selectSelectedYear) => {
        const mileConversion = 0.6214;
        const activitiesCurrentYear = [];
        activities.forEach(userActivities => {
            const cycles = _.filter(userActivities.allCycles, cycle => { return isThisYear(cycle.startDate, selectSelectedYear) })
            const runs = _.filter(userActivities.allRuns, run => { return isThisYear(run.startDate, selectSelectedYear) });
            const swims = _.filter(userActivities.allSwims, swim => { return isThisYear(swim.startDate, selectSelectedYear) });
            const runDistance = runs.reduce((a, b) => a + (parseFloat(b['distance']) || 0), 0);
            const cycleDistance = cycles.reduce((a, b) => a + (parseFloat(b['distance']) || 0), 0);
            const swimDistance = swims.reduce((a, b) => a + (parseFloat(b['distance']) || 0), 0);
            const newUser = {
                ...userActivities,
                allRuns: runs,
                runDistance: runDistance.toFixed(2),
                runDistanceMile: (runDistance * mileConversion).toFixed(2),
                runQuantity: runs.length,
                allCycles: cycles,
                bikeDistance: cycleDistance.toFixed(2),
                bikeDistanceMile: (cycleDistance * mileConversion).toFixed(2),
                bikeQuantity: cycles.length,
                allSwims: swims,
                swimDistance: (swimDistance/1000).toFixed(2),
                swimDistanceMile: ((swimDistance * mileConversion)/1000).toFixed(2),
                swimQuantity: swims.length
            }
            activitiesCurrentYear.push(newUser);
        });

        return activitiesCurrentYear;
    }
);

export const selectFormattedActivitiesForCurrentYearWithPercentage = createSelector(
    selectFormattedActivitiesForCurrentYear,
    selectSelectedYear,
    (activities, selectSelectedYear) => {
        const activitiesPercentage = activities.map(user => {
            return calculateTotalPercent(user, selectSelectedYear);
        })

        return _.orderBy(activitiesPercentage, ['totalPercentage'], ['desc']);
    }
);

export const selectFormattedUserActivityForCurrentYear = createSelector(
    selectFormattedActivitiesForCurrentYearWithPercentage,
    selectCurrentUser,
    (formattedActivities, currentUser) => _.find(formattedActivities, userActivity => userActivity.name === currentUser)
);

export const selectFormattedUserSpecificActivityCurrentYear = createSelector(
    selectFormattedUserActivityForCurrentYear,
    selectCurrentActivityType,
    (userActivity, currentActivityType) => {
        switch(currentActivityType) {
            case "run":
                return userActivity?.allRuns;
            case "cycle":
                return userActivity?.allCycles;
            case "swim":
                return userActivity?.allSwims;
        }
    }

//    currentActivityType === "run" ? userActivity?.allRuns : userActivity?.allCycles
);

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

    const segment = activity === "run" ? 2.5
                      : activity === "cycle" ? 5
                      : activity === "swim" ? 400
                      : 1;

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
    const segment = activity === "run" ? "2.5"
                                  : activity === "cycle" ? "5"
                                  : activity === "swim" ? "400"
                                  : "1";
    const unitRange = unit === "km" ? segment : "3m";
    const header = ["ID", "Date", whatSpeed, unitRange, "Distance"];
    data.push(header);

    const orderedRows = _.sortBy(rows, o => parseFloat(o.distance));

    orderedRows.forEach((row) => {
        const averageSpeed = unit === "km" ? row.averageSpeed : row.averageSpeedMile;
        const distance = unit === "km" ? row.distance : row.distanceMile;
        const unitRange = unit === "km" ? getSegK(distance, activity) : getThreeM(distance);
        let speed = parseFloat(averageSpeed);
        if (activity === "run" || activity === "swim") {
            speed = formatSpeed(averageSpeed);
        }
        const dataRow =[averageSpeed, getDate(row.date), speed, unitRange, parseFloat(distance)];
        data.push(dataRow);
    });

    return data;
}

export const selectChartData = createSelector(
    selectUserSpecificActivity,
    selectActivityUnit,
    selectCurrentActivityType,
    (currentUserActivity, currentUnit, currentActivity) => parseData(currentUserActivity, currentActivity, currentUnit)
);

export const selectChartDataCurrentYear = createSelector(
    selectFormattedUserSpecificActivityCurrentYear,
    selectActivityUnit,
    selectCurrentActivityType,
    (currentUserActivity, currentUnit, currentActivity) => parseData(currentUserActivity, currentActivity, currentUnit)
);

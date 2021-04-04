import {call, put} from 'redux-saga/effects';
import * as actions from '../actions';

const getUsers = async () => {
    const userLink = "https://raj.bariah.com:2010/strava/users";
    return await fetch(userLink)
        .then(res => res.json());
}

const getActivities = async (athleteID) => {
    const activitiesLink = "https://raj.bariah.com:2010/strava/activity?athlete=" + athleteID;

    const activities = [];
    await fetch(activitiesLink)
        .then(res => res.json())
        .then(res => {
            activities.push.apply(activities, res);
        });

    return activities;
}

export function* fetchUsersAndActivitiesSaga() {
    try {
        const users = yield call(getUsers)

        yield put(actions.fetchUsersSuccess(users));

        const activities = [];
        for (let i = 0; i < users.length; i++) {
            const activity = yield call(getActivities, users[i].athleteID) // this is where the inefficiency lies
            activities.push.apply(activities, activity);
        }
        yield put(actions.fetchActivitiesSuccess(activities));
    } catch (error) {
        yield put(actions.fetchUsersFailure(error));
    }
}
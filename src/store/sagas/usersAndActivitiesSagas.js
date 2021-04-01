import { call, put } from 'redux-saga/effects';
import * as actions from '../actions';

const getUsers = async () => {
    const userLink = "https://raj.bariah.com:2010/strava/users";
    const users = await fetch(userLink)
        .then(res => res.json());

    return users;
}

export function* fetchUsersSaga() {
    try {
        const users = yield call(getUsers)

        yield put(actions.fetchUsersSuccess(users));

        yield call(fetchActivitiesSaga, users);
    } catch (error) {
        yield put(actions.fetchUsersFailure(error));
    }
}

const fetchActivities = async (athleteID) => {
    const activitiesLink = "https://raj.bariah.com:2010/strava/activity?athlete=" + athleteID;

    const activities = [];
    await fetch(activitiesLink)
        .then(res => res.json())
        .then(res => {
            activities.push.apply(activities, res);
        });

    return activities;
}

function* fetchActivitiesSaga(users) {
    try {
        const activities = [];
        for (let i = 0; i < users.length; i++) {
            const activity = yield call(fetchActivities, users[i].athleteID) // this is where the inefficiency lies
            activities.push.apply(activities, activity);
        }
        yield put(actions.fetchActivitiesSuccess(activities));
    } catch (error) {
        yield put(actions.fetchActivitiesFailure(error));
    }
}
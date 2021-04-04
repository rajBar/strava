import {call, put} from 'redux-saga/effects';
import * as actions from '../actions';

const getUsers = async () => {
    const userLink = "https://raj.bariah.com:2010/strava/users";
    return await fetch(userLink)
        .then(res => res.json());
}

export function* fetchUsersSaga() {
    try {
        const users = yield call(getUsers)
        yield put(actions.fetchUsersSuccess(users));

    } catch (error) {
        yield put(actions.fetchUsersFailure(error));
    }
}

const getActivities = async () => {
    const activitiesLink = "https://raj.bariah.com:2010/strava/activities";

    return await fetch(activitiesLink)
        .then(res => res.json());
}

export function* fetchActivitiesSaga() {
    try {
        const activities = yield call(getActivities);
        yield put(actions.fetchActivitiesSuccess(activities));
    } catch (error) {
        yield put(actions.fetchActivitiesFailure(error));
    }
}
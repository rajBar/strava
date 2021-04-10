import {call, put} from 'redux-saga/effects';
import * as actions from '../actions';

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
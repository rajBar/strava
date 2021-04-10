import { takeEvery } from 'redux-saga/effects';
import * as actionTypes from '../actionTypes';
import * as usersSagas from './usersSagas';
import * as activitiesSagas from './activitiesSagas';

export function* usersWatcher() {
    yield takeEvery(actionTypes.FETCH_USERS, usersSagas.fetchUsersSaga);
}

export function* activitiesWatcher() {
    yield takeEvery(actionTypes.FETCH_ACTIVITIES, activitiesSagas.fetchActivitiesSaga);
}

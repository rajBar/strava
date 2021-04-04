import { takeEvery } from 'redux-saga/effects';
import * as actionTypes from '../actionTypes';
import * as usersAndActivitiesSagas from './usersAndActivitiesSagas';

export function* usersWatcher() {
    yield takeEvery(actionTypes.FETCH_USERS_AND_ACTIVITIES, usersAndActivitiesSagas.fetchUsersAndActivitiesSaga);
}

import { takeEvery } from 'redux-saga/effects';
import * as actionTypes from '../actionTypes';
import * as usersSagas from './usersSagas';

export function* usersWatcher() {
    yield takeEvery(actionTypes.FETCH_USERS, usersSagas.fetchUsersSaga);
}

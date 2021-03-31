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
    } catch (error) {
        yield put(actions.fetchUsersFailure(error));
    }
}

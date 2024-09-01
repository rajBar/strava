import {call, put} from 'redux-saga/effects';
import * as actions from '../actions';
import {fetchActivitiesSaga} from "./activitiesSagas";
import {users} from "../tmp-data/users.js";

const getUsers = async () => {
    // const userLink = "https://raj.bariah.com:2010/strava/users";
    // const userLink = "https://rajbar.hopto.org:2010/strava/users";
    // const userLink = "https://api.rajbar.duckdns.org/strava/users";
    const userLink = "https://api.rajbariah.com/strava/users";
    return await fetch(userLink)
        .then(res => res.json());
//    return users;
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

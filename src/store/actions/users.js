import * as actionTypes from '../actionTypes/users';

export const fetchUsers = () => ({
    type: actionTypes.FETCH_USERS,
});

export const fetchUsersSuccess = users => ({
    type: actionTypes.FETCH_USERS_SUCCESS,
    payload: { users },
});

export const fetchUsersFailure = error => ({
    type: actionTypes.FETCH_USERS_FAILURE,
    payload: { error },
});
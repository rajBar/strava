import * as actionTypes from '../actionTypes/usersAndActivities';

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

export const fetchActivities = () => ({
    type: actionTypes.FETCH_ACTIVITIES,
});

export const fetchActivitiesSuccess = activities => ({
    type: actionTypes.FETCH_ACTIVITIES_SUCCESS,
    payload: { activities },
});

export const fetchActivitiesFailure = error => ({
    type: actionTypes.FETCH_ACTIVITIES_FAILURE,
    payload: { error },
});
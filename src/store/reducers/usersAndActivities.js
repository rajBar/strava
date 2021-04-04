import * as actionTypes from '../actionTypes/usersAndActivities';

const initialState = {
    users: [],
    activities: [],
    errors: {
        usersError: null,
        activitiesError: null,
    },
};

const fetchUsersSuccess = (state, action) => ({
    ...state,
    users: action.payload.users,
});

const fetchUsersFailure = (state, action) => ({
    ...state,
    errors: {
        ...state.errors,
        usersError: action.payload.error,
    },
});

const fetchActivitiesSuccess = (state, action) => ({
    ...state,
    activities: action.payload.activities,
});

const fetchActivitiesFailure = (state, action) => ({
    ...state,
    errors: {
        ...state.errors,
        activitiesError: action.payload.error,
    },
});

export default (state = initialState, action) => {
    switch(action.type) {
        case actionTypes.FETCH_USERS_SUCCESS:
            return fetchUsersSuccess(state, action);
        case actionTypes.FETCH_USERS_FAILURE:
            return fetchUsersFailure(state, action);
        case actionTypes.FETCH_ACTIVITIES_SUCCESS:
            return fetchActivitiesSuccess(state, action);
        case actionTypes.FETCH_ACTIVITIES_FAILURE:
            return fetchActivitiesFailure(state, action);
        default:
            return state;
    }
};
import * as actionTypes from '../actionTypes/activities';

const initialState = {
    activities: [],
    currentActivityType: 'run',
    activityUnit: 'km',
    error: null,
};

const fetchActivitiesSuccess = (state, action) => ({
    ...state,
    activities: action.payload.activities,
});

const fetchActivitiesFailure = (state, action) => ({
    ...state,
    error: action.payload.error,
});

const setCurrentActivityType = (state, action) => ({
    ...state,
    currentActivityType: action.payload.activityType,
});

const setActivityUnit = (state, action) => ({
    ...state,
    activityUnit: action.payload.activityUnit,
})

export default (state = initialState, action) => {
    switch(action.type) {
        case actionTypes.FETCH_ACTIVITIES_SUCCESS:
            return fetchActivitiesSuccess(state, action);
        case actionTypes.FETCH_ACTIVITIES_FAILURE:
            return fetchActivitiesFailure(state, action);
        case actionTypes.SET_CURRENT_ACTIVITY_TYPE:
            return setCurrentActivityType(state, action);
        case actionTypes.SET_ACTIVITY_UNIT:
            return setActivityUnit(state, action);
        default:
            return state;
    }
};
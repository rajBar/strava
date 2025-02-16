import * as actionTypes from "../actionTypes/activities";

export const fetchActivitiesSuccess = activities => ({
    type: actionTypes.FETCH_ACTIVITIES_SUCCESS,
    payload: { activities },
});

export const fetchActivitiesFailure = error => ({
    type: actionTypes.FETCH_ACTIVITIES_FAILURE,
    payload: { error },
});

export const setCurrentActivityType = activityType => ({
    type: actionTypes.SET_CURRENT_ACTIVITY_TYPE,
    payload: { activityType },
});

export const setActivityUnit = activityUnit => ({
    type: actionTypes.SET_ACTIVITY_UNIT,
    payload: { activityUnit },
})

export const setSelectedYear = selectedYear => ({
    type: actionTypes.SET_SELECTED_YEAR,
    payload: { selectedYear },
});
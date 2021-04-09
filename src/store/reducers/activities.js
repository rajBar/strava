import * as actionTypes from '../actionTypes/activities';

const initialState = {
    activities: [],
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

export default (state = initialState, action) => {
    switch(action.type) {
        case actionTypes.FETCH_ACTIVITIES_SUCCESS:
            return fetchActivitiesSuccess(state, action);
        case actionTypes.FETCH_ACTIVITIES_FAILURE:
            return fetchActivitiesFailure(state, action);
        default:
            return state;
    }
};
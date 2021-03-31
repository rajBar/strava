import * as actionTypes from '../actionTypes/users';

const initialState = {
    users: [],
    error: null,
};

const fetchUsersSuccess = (state, action) => ({
    ...state,
    users: action.payload.users,
});

const fetchUsersFailure = (state, action) => ({
    ...state,
    error: action.payload.error,
});

export default (state = initialState, action) => {
    switch(action.type) {
        case actionTypes.FETCH_USERS_SUCCESS:
            return fetchUsersSuccess(state, action);
        case actionTypes.FETCH_USERS_FAILURE:
            return fetchUsersFailure(state, action);
        default:
            return state;
    }
};
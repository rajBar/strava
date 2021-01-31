import { SET_ACTIVITIES } from "../constants";

const initialState = {
    activities: [],
}

const reducer = (state = initialState, action) => {
    switch (action.type) {
        case SET_ACTIVITIES:
            return {
                ...state,
                activities: action.payload,
            };
        default:
            return state;
    }
}

export default reducer;

import {SET_ACTIVITIES} from "../constants";

export const setActivities = activities => ({
    type: SET_ACTIVITIES,
    payload: {
        ...activities
    },
})

import { combineReducers } from "redux";
import users from "./users";
import activities from "./activities";

export const rootReducer = combineReducers({
    users,
    activities,
})

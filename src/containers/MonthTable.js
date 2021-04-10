import { connect } from 'react-redux';
import MonthTable from "../components/MonthTable/MonthTable";
import {selectCurrentUser, selectUserNames} from "../store/selectors/users";
import {
    selectActivityUnit,
    selectCurrentActivityType,
    selectFormattedActivitiesForCurrentYear,
    selectFormattedUserActivityForCurrentYear
} from "../store/selectors/activities";
import * as actions from "../store/actions";

const mapStateToProps = state => ({
    allRows: selectFormattedActivitiesForCurrentYear(state),
    formattedUserActivityForCurrentYear: selectFormattedUserActivityForCurrentYear(state),
    userNames: selectUserNames(state),
    currentUser: selectCurrentUser(state),
    currentActivityType: selectCurrentActivityType(state),
    activityUnit: selectActivityUnit(state),
});

const mapDispatchToProps = dispatch => ({
    setCurrentUser: user => dispatch(actions.setCurrentUser(user)),
    setCurrentActivityType: activityType => dispatch(actions.setCurrentActivityType(activityType)),
    setActivityUnit: activityUnit => dispatch(actions.setActivityUnit(activityUnit)),
});

export default connect(mapStateToProps, mapDispatchToProps)(MonthTable);
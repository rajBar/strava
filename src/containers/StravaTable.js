import { connect } from 'react-redux';
import StravaTable from "../components/StravaTable/StravaTable";
import {selectCurrentUser, selectUserNames} from "../store/selectors/users";
import {selectCurrentActivityType, selectFormattedActivities} from "../store/selectors/activities";
import * as actions from '../store/actions';

const mapStateToProps = state => ({
    allRows: selectFormattedActivities(state),
    orderedRows: selectFormattedActivities(state),
    userNames: selectUserNames(state),
    currentUser: selectCurrentUser(state),
    currentActivityType: selectCurrentActivityType(state),
});

const mapDispatchToProps = dispatch => ({
    setCurrentUser: user => dispatch(actions.setCurrentUser(user)),
    setCurrentActivityType: activityType => dispatch(actions.setCurrentActivityType(activityType)),
});

export default connect(mapStateToProps, mapDispatchToProps)(StravaTable);
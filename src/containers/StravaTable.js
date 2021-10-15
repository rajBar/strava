import { connect } from 'react-redux';
import StravaTable from "../components/StravaTable/StravaTable";
import {selectCurrentUser, selectUserNames} from "../store/selectors/users";
import {
    selectActivityUnit,
    selectCurrentActivityType,
    selectActivities,
    selectUserSpecificActivity
} from "../store/selectors/activities";
import * as actions from '../store/actions';

const mapStateToProps = state => ({
    allRows: selectActivities(state),
    currentUserCurrentActivityData: selectUserSpecificActivity(state),
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

export default connect(mapStateToProps, mapDispatchToProps)(StravaTable);
import { connect } from 'react-redux';
import StravaTable from "../components/StravaTable/StravaTable";
import {selectCurrentUser, selectUserNames} from "../store/selectors/users";
import { selectFormattedActivities } from "../store/selectors/activities";
import * as actions from '../store/actions';

const mapStateToProps = state => ({
    allRows: selectFormattedActivities(state),
    orderedRows: selectFormattedActivities(state),
    userNames: selectUserNames(state),
    currentUser: selectCurrentUser(state),
});

const mapDispatchToProps = dispatch => ({
    setCurrentUser: user => dispatch(actions.setCurrentUser(user)),
});

export default connect(mapStateToProps, mapDispatchToProps)(StravaTable);
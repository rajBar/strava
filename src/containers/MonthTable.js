import { connect } from 'react-redux';
import MonthTable from "../components/MonthTable/MonthTable";
import {selectCurrentUser, selectUserNames} from "../store/selectors/users";
import { selectFormattedActivitiesForCurrentYear } from "../store/selectors/activities";
import * as actions from "../store/actions";

const mapStateToProps = state => ({
    allRows: selectFormattedActivitiesForCurrentYear(state),
    userNames: selectUserNames(state),
    currentUser: selectCurrentUser(state),
});

const mapDispatchToProps = dispatch => ({
    setCurrentUser: user => dispatch(actions.setCurrentUser(user)),
});

export default connect(mapStateToProps, mapDispatchToProps)(MonthTable);
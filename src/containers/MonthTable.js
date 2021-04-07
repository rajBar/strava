import { connect } from 'react-redux';
import MonthTable from "../components/MonthTable/MonthTable";
import { selectUserNames, selectFormattedActivitiesForCurrentYear } from "../store/selectors/usersAndActivities";

const mapStateToProps = state => ({
    allRows: selectFormattedActivitiesForCurrentYear(state),
    userNames: selectUserNames(state),
});

const mapDispatchToProps = dispatch => ({});

export default connect(mapStateToProps, mapDispatchToProps)(MonthTable);
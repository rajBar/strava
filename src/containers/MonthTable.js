import { connect } from 'react-redux';
import MonthTable from "../components/MonthTable/MonthTable";
import { selectUserNames } from "../store/selectors/users";
import { selectFormattedActivitiesForCurrentYear } from "../store/selectors/activities";

const mapStateToProps = state => ({
    allRows: selectFormattedActivitiesForCurrentYear(state),
    userNames: selectUserNames(state),
});

const mapDispatchToProps = dispatch => ({});

export default connect(mapStateToProps, mapDispatchToProps)(MonthTable);
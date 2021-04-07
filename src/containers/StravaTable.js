import { connect } from 'react-redux';
import StravaTable from "../components/StravaTable/StravaTable";
import { selectUserNames, selectFormattedActivities } from "../store/selectors/usersAndActivities";

const mapStateToProps = state => ({
    allRows: selectFormattedActivities(state),
    orderedRows: selectFormattedActivities(state),
    userNames: selectUserNames(state),
});

const mapDispatchToProps = dispatch => ({});

export default connect(mapStateToProps, mapDispatchToProps)(StravaTable);
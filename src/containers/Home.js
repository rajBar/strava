import { connect } from 'react-redux';
import Home from '../components/Home/Home';
import * as actions from "../store/actions";

const mapStateToProps = state => ({
    users: state.usersAndActivities.users,
    activities: state.usersAndActivities.activities,
});

const mapDispatchToProps = dispatch => ({
    fetchUsers: () => dispatch(actions.fetchUsers()),
    fetchActivities: () => dispatch(actions.fetchActivities()),
});

export default connect(mapStateToProps, mapDispatchToProps)(Home);
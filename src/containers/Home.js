import { connect } from 'react-redux';
import Home from '../components/Home/Home';
import * as actions from "../store/actions";

const mapStateToProps = () => ({});

const mapDispatchToProps = dispatch => ({
    fetchUsers: () => dispatch(actions.fetchUsers()),
});

export default connect(mapStateToProps, mapDispatchToProps)(Home);
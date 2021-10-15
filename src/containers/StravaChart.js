import { connect } from 'react-redux';
import StravaChart from "../components/StravaChart/StravaChart";
import {
    selectActivityUnit,
    selectChartData,
    selectChartDataCurrentYear,
    selectCurrentActivityType
} from "../store/selectors/activities";

const mapStateToProps = state => ({
    currentActivityType: selectCurrentActivityType(state),
    activityUnit: selectActivityUnit(state),
    chartData: selectChartData(state),
    chartDataCurrentYear: selectChartDataCurrentYear(state),
});

const mapDispatchToProps = dispatch => ({});

export default connect(mapStateToProps, mapDispatchToProps)(StravaChart);
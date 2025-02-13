import React, {Component} from "react";
import Chart from "react-google-charts";

class StravaChart extends Component {
    constructor(props) {
        super(props);
    }

    parseOptions(activity, unit) {
        const unitType = unit === "km" ? "k" : "m";
        const swimSpeedUnit = unit === "km" ? "100m" : "100y";
        const speed = activity === "cycle" ?
            unitType + "ph" :
            "min/" + (activity === "run" ?
                unit :
                swimSpeedUnit)

        return {
            title: "Lifetime " + activity + "s",
            hAxis: {
                title: "date"
            },
            vAxis: {
                title: speed,
                gridlines: {
                    units: {
                        hours: {format: ['']},
                        minutes: {format: ['mm:ss']},
                        seconds: {format: ['mm:ss']},
                    }
                }
            },
            bubble: { textStyle: { fontSize: 11 } }
        }
    }

    render() {
        const {currentActivityType, activityUnit, chartData, chartDataCurrentYear, currentYear} = this.props;
        const data = currentYear ? chartDataCurrentYear : chartData;

        const options = currentActivityType ? this.parseOptions(currentActivityType, activityUnit) : [];

        return (
            <div className="App">
                <Chart
                    chartType="BubbleChart"
                    width="100%"
                    height="400px"
                    data={data}
                    options={options}
                />
            </div>
        );
    }
}

export default StravaChart;

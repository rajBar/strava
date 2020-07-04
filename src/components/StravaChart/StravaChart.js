import React, {Component} from "react";
import Chart from "react-google-charts";

class StravaChart extends Component {
    options = {
        title:
            "Correlation between life expectancy, fertility rate " +
            "and population of some world countries (2010)",
        hAxis: { title: "Life Expectancy" },
        vAxis: { title: "Fertility Rate" },
        bubble: { textStyle: { fontSize: 11 } }
    };

    parseOptions(rows, activity) {
        return {
            title: "Lifetime " + activity + "s",
            hAxis: { title: "Date" },
            vAxis: { title: "Speed" },
            bubble: { textStyle: { fontSize: 11 } }
        }
    }

    data = [
        ["ID", "Life Expectancy", "Fertility Rate", "Region", "Population"],
        ["CAN", 80.66, 1.67, "North America", 33739900],
        ["DEU", 79.84, 1.36, "Europe", 81902307],
        ["DNK", 78.6, 1.84, "Europe", 5523095],
        ["EGY", 72.73, 2.78, "Middle East", 79716203],
        ["GBR", 80.05, 2, "Europe", 61801570],
        ["IRN", 72.49, 1.7, "Middle East", 73137148],
        ["IRQ", 68.09, 4.77, "Middle East", 31090763],
        ["ISR", 81.55, 2.96, "Middle East", 7485600],
        ["RUS", 68.6, 1.54, "Europe", 141850000],
        ["USA", 78.09, 2.05, "North America", 307007000]
    ];

    parseData(rows, activity) {
        const speedUnit = activity === "run" ? "min/km" : "km/h";
    }

    render() {
        const {activity, rows} = this.props;
        const orderedRows = [].concat(rows).reverse();
        const data = this.data;
        // const data = this.parseData(orderedRows, activity);
        const options = this.parseOptions(activity);

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
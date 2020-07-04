import React, {Component} from "react";
import Chart from "react-google-charts";

class StravaChart extends Component {

    parseOptions(activity) {
        const speed = activity === "run" ? "min/km" : "km/h"
        return {
            title: "Lifetime " + activity + "s",
            hAxis: { title: activity + " no." },
            vAxis: { title: speed },
            bubble: { textStyle: { fontSize: 11 } }
        }
    }

    parseData(rows) {
        const data = [];
        const header = ["ID", "Activity Number", "Speed", "Activity", "Distance"];
        data.push(header);

        rows.forEach((row, i) => {
            const dataRow =[row.date.substr(0,2), i+1, parseFloat(row.averageSpeed), row.date.substr(3, 5), parseFloat(row.distance)];
            data.push(dataRow);
        });

        return data;
    }

    render() {
        const {activity, rows} = this.props;
        const orderedRows = [].concat(rows).reverse();
        const data = this.parseData(orderedRows);

        const options = activity ? this.parseOptions(activity) : [];

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

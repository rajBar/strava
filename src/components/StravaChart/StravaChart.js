import React, {Component} from "react";
import Chart from "react-google-charts";

class StravaChart extends Component {

    parseOptions(activity) {
        const speed = activity === "run" ? "min/km" : "km/h"
        return {
            title: "Lifetime " + activity + "s",
            hAxis: { title: activity + " no." },
            vAxis: {
                title: speed,
                gridlines: {
                    units: {
                        seconds: {format: ['mm:ss']},
                    }
                }
            },
            bubble: { textStyle: { fontSize: 11 } }
        }
    }

    formatSpeed(speed) {
        const speedSplit = speed.toString().split(".");
        const minute = speedSplit[0];
        const second = speedSplit[1];

        const rowDate = new Date(2010, 1, 1, 1, parseInt(minute), parseInt(second), 0);

        return rowDate;
    }

    parseData(rows, activity) {
        const data = [];
        const header = ["ID", "Activity Number", "Speed", "Activity", "Distance"];
        data.push(header);

        rows.forEach((row, i) => {
            let speed = parseFloat(row.averageSpeed);
            if (activity === "run") {
                speed = this.formatSpeed(row.averageSpeed);
            }
            const dataRow =[row.date.substr(0,2), i+1, speed, row.date.substr(3, 5), parseFloat(row.distance)];
            data.push(dataRow);
        });

        return data;
    }

    render() {
        const {activity, rows} = this.props;
        const orderedRows = [].concat(rows).reverse();
        const data = this.parseData(orderedRows, activity);

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

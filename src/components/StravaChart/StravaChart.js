import React, {Component} from "react";
import Chart from "react-google-charts";

class StravaChart extends Component {

    parseOptions(activity) {
        const speed = activity === "run" ? "min/km" : "km/h"
        return {
            title: "Lifetime " + activity + "s",
            hAxis: {
                title: "date"
            },
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

        const rowDate = new Date(2000, 0, 1, 1, parseInt(minute), parseInt(second), 0);

        return rowDate;
    }

    getDate(date) {
        const dateSplit = date.split("/");
        const day = parseInt(dateSplit[0]);
        const month = parseInt(dateSplit[1]) - 1;
        const year = parseInt(dateSplit[2]) + 2000;

        const newDate = new Date(year, month, day);

        return newDate;
    }

    getFiveK(distance) {
        const newDistance = parseFloat(distance);

        const ceilingFive = Math.ceil(newDistance / 5) * 5;
        const floorFive = ceilingFive - 5;

        const fiveKSeg = floorFive + "k - " + ceilingFive + "k";

        return fiveKSeg;
    }

    parseData(rows, activity) {
        const data = [];
        const header = ["ID", "Date", "N/A", "5k", "Distance"];
        data.push(header);

        rows.forEach((row, i) => {
            let speed = parseFloat(row.averageSpeed);
            if (activity === "run") {
                speed = this.formatSpeed(row.averageSpeed);
            }
            const dataRow =[row.averageSpeed, this.getDate(row.date), speed, this.getFiveK(row.distance), parseFloat(row.distance)];
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

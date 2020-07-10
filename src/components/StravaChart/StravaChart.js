import React, {Component} from "react";
import Chart from "react-google-charts";
import _ from 'lodash';

class StravaChart extends Component {

    parseOptions(activity, unit) {
        const unitType = unit === "km" ? "k" : "m"
        const speed = activity === "run" ? "min/" + unit : unitType + "ph";
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

    parseData(rows, activity, unit) {
        const data = [];
        const whatSpeed = activity === "run" ? "N/A" : "Speed (km/h)";
        const header = ["ID", "Date", whatSpeed, "5k", "Distance"];
        data.push(header);

        const orderedRows = _.sortBy(rows, o => parseFloat(o.distance));

        orderedRows.forEach((row) => {
            const averageSpeed = unit === "km" ? row.averageSpeed : row.averageSpeedMile;
            const distance = unit === "km" ? row.distance : row.distanceMile;
            let speed = parseFloat(averageSpeed);
            if (activity === "run") {
                speed = this.formatSpeed(averageSpeed);
            }
            const dataRow =[averageSpeed, this.getDate(row.date), speed, this.getFiveK(distance), parseFloat(distance)];
            data.push(dataRow);
        });

        return data;
    }

    render() {
        const {activity, rows, unit} = this.props;
        const orderedRows = [].concat(rows).reverse();
        const data = this.parseData(orderedRows, activity, unit);

        const options = activity ? this.parseOptions(activity, unit) : [];

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

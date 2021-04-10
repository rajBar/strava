import React, {Component} from "react";
import Chart from "react-google-charts";
import _ from 'lodash';

class StravaChart extends Component {
    constructor(props) {
        super(props);
        this.state = {
            runSegments: 2.5,
            cycleSegments: 5,
        }
    }

    parseOptions(activity, unit) {
        const unitType = unit === "km" ? "k" : "m";
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
                        hours: {format: ['']},
                        minutes: {format: ['mm:ss']},
                        seconds: {format: ['mm:ss']},
                    }
                }
            },
            bubble: { textStyle: { fontSize: 11 } }
        }
    }

    formatSpeed(speed) {
        const speedSplit = speed.toString().split(".");
        const minute = parseInt(speedSplit[0]);
        const second = parseInt(speedSplit[1]);

        const rowDate = new Date(2000, 0, 1, 1, minute, second, 0);

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

    getSegK(distance, activity) {
        const newDistance = parseFloat(distance);

        const segment = activity === "run" ? this.state.runSegments : this.state.cycleSegments;

        const ceilingFive = Math.ceil(newDistance / segment) * segment;
        const floorFive = ceilingFive - segment;

        const fiveKSeg = floorFive + "k - " + ceilingFive + "k";

        return fiveKSeg;
    }

    getThreeM(distance) {
        const newDistance = parseFloat(distance);

        const ceilingFive = Math.ceil(newDistance / 3) * 3;
        const floorFive = ceilingFive - 3;

        const fiveKSeg = floorFive + "m - " + ceilingFive + "m";

        return fiveKSeg;
    }

    parseData(rows, activity, unit) {
        const data = [];
        const whatSpeed = activity === "run" ? "N/A" : "Speed (km/h)";
        const segment = activity === "run" ? this.state.runSegments + "k" : this.state.cycleSegments + "k";
        const unitRange = unit === "km" ? segment : "3m";
        const header = ["ID", "Date", whatSpeed, unitRange, "Distance"];
        data.push(header);

        const orderedRows = _.sortBy(rows, o => parseFloat(o.distance));

        orderedRows.forEach((row) => {
            const averageSpeed = unit === "km" ? row.averageSpeed : row.averageSpeedMile;
            const distance = unit === "km" ? row.distance : row.distanceMile;
            const unitRange = unit === "km" ? this.getSegK(distance, activity) : this.getThreeM(distance);
            let speed = parseFloat(averageSpeed);
            if (activity === "run") {
                speed = this.formatSpeed(averageSpeed);
            }
            const dataRow =[averageSpeed, this.getDate(row.date), speed, unitRange, parseFloat(distance)];
            data.push(dataRow);
        });

        return data;
    }

    render() {
        const {currentActivityType, rows, activityUnit} = this.props;
        // const orderedRows = [].concat(rows).reverse();
        const data = this.parseData(rows, currentActivityType, activityUnit);

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

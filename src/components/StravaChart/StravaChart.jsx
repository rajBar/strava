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

        return new Date(2000, 0, 1, 1, minute, second, 0);
    }

    getDate(date) {
        const dateSplit = date.split("/");
        const day = parseInt(dateSplit[0]);
        const month = parseInt(dateSplit[1]) - 1;
        const year = parseInt(dateSplit[2]) + 2000;

        return new Date(year, month, day);
    }

    getSegK(distance, activity) {
        const newDistance = parseFloat(distance);

        const segment = activity === "run" ? this.state.runSegments : this.state.cycleSegments;

        const ceilingFive = Math.ceil(newDistance / segment) * segment;
        const floorFive = ceilingFive - segment;

        return floorFive + "k - " + ceilingFive + "k";
    }

    getThreeM(distance) {
        const newDistance = parseFloat(distance);

        const ceilingThree = Math.ceil(newDistance / 3) * 3;
        const floorThree = ceilingThree - 3;

        return floorThree + "m - " + ceilingThree + "m";
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

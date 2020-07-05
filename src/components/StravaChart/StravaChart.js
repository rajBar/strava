import React, {Component} from "react";
import Chart from "react-google-charts";

class StravaChart extends Component {

    parseOptions(activity) {
        const speed = activity === "run" ? "min/km" : "km/h"
        return {
            title: "Lifetime " + activity + "s",
            hAxis: {
                title: activity + " no.",
                gridlines: {
                    multiple: 1
                }
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

        const rowDate = new Date(0, 0, 0, 0, parseInt(minute), parseInt(second), 0);

        return rowDate;
    }

    extractMonth(day) {
        const date = day.split("/");
        const monthVal = parseInt(date[0] - 1);
        const year = date[1];
        const monthList = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        const month = monthList[monthVal];

        const newDay = month + " " + year;

        return newDay;
    }

    addDaySuffix(day) {
        let updatedDay;
        if (day.substr(0,1) === "0") {
            updatedDay = day.substr(1,1);
        } else {
            updatedDay = day;
        }

        let newDay;
        if ((day === "01") || (day === "21") || (day === "31")) {
            newDay = updatedDay + "st";
        } else if ((day === "02") || (day === "22")) {
            newDay = updatedDay + "nd";
        } else if ((day === "03") || (day === "23")) {
            newDay = updatedDay + "rd";
        } else {
            newDay = updatedDay + "th";
        }

        return newDay
    }

    parseData(rows, activity) {
        const data = [];
        const header = ["ID", "Activity Number", "Speed", "Month", "Distance"];
        data.push(header);

        rows.forEach((row, i) => {
            let speed = parseFloat(row.averageSpeed);
            if (activity === "run") {
                speed = this.formatSpeed(row.averageSpeed);
            }
            const dataRow =[this.addDaySuffix(row.date.substr(0,2)), i+1, speed, this.extractMonth(row.date.substr(3, 5)), parseFloat(row.distance)];
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

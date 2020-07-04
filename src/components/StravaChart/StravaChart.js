import React, {Component} from "react";
import Chart from "react-google-charts";

class StravaChart extends Component {

    parseOptions(activity) {
        return {
            title: "Lifetime " + activity + "s",
            hAxis: { title: activity + " no." },
            vAxis: { title: "Speed" },
            bubble: { textStyle: { fontSize: 11 } }
        }
    }

    parseData(rows, activity) {
        const speedUnit = activity === "run" ? "min/km" : "km/h";

        const data = [];
        const header = ["ID", "Activity Number", "Speed", "Activity", "Distance"];
        data.push(header);

        rows.forEach((row, i) => {
            // const date = fixDate(row.date);
            // const dataRow =[i.toString(), row.date, row.averageSpeed, "Something", row.distance];
            const dataRow =[row.date.substr(0,2), i+1, parseFloat(row.averageSpeed), row.date.substr(3, 5), parseFloat(row.distance)];
            data.push(dataRow);
        })

        return data;
    }

    render() {
        const {activity, rows} = this.props;
        const orderedRows = [].concat(rows).reverse();
        // const data = this.data;
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

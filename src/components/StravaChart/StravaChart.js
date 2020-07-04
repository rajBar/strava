import React, {Component} from "react";
import Chart from "react-google-charts";

class StravaChart extends Component {

    parseOptions(activity) {
        return {
            title: "Lifetime " + activity + "s",
            hAxis: { title: "Activity Number" },
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
            const dataRow =[(i+1).toString(), i+1, parseFloat(row.averageSpeed), activity, parseFloat(row.distance)];
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

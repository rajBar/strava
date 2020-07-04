import React, {Component} from 'react';
import './StravaTable-style.css';

class StravaTable extends Component {
    constructor(props) {
        super(props);
        this.state = {
            tableHead: [
                'Name',
                'No. Runs',
                'Run Distance',
                'No. Cycles',
                'Cycle Distance',
            ],
            tableHeadSecond: [
                'Date',
                'Activity',
                'Distance',
                'Average Speed',
                'Activity Time',
                'Elevation Gain',
            ],
            currentActivity: "run",
            user: "",
        }
    }

    getHeader(headers) {
        return headers.map((header, i) => {
            return <th key={i} className="myTableHeaders">{header}</th>
        })
    }

    setUser(athlete) {
        this.setState({
            ...this.state,
            user: athlete,
        });
    }

    getRowsData(row, i) {
        const name = row.name;
        const runNo = row.runQuantity;
        const runDistance = row.runDistance;
        const cycleNo = row.bikeQuantity;
        const cycleDistance = row.bikeDistance;
        const percentage = row.totalPercent;

        return (
            <tr onClick={() => this.setUser(name)}>
                <td key={i} className="myTableContents">{name} {percentage == 100 ? "(completed)" : ""}</td>
                <td key={i} className="myTableContents">{runNo}</td>
                <td key={i} className="myTableContents">{runDistance} km</td>
                <td key={i} className="myTableContents">{cycleNo}</td>
                <td key={i} className="myTableContents">{cycleDistance} km</td>
            </tr>
        )
    }

    sepMethod() {
        return (
            <tr>
                <td key={2000}>-----</td>
                <td key={2000}>-----</td>
                <td key={2000}>---------</td>
                <td key={2000}>--------</td>
                <td key={2000}>--------</td>
            </tr>
        );
    }

    setActivity(activity){
        this.setState({
            ...this.state,
            currentActivity: activity,
        })
    }

    detailedRows(rows) {
        const user = this.state.user;

        let userRows = {};

        rows.forEach(row => {
            if (row.name === user) {
                userRows = row;
            } else {
                userRows = {};
            }
        })

        console.log(userRows.allRuns);

        if (user === "") {
            return <br />;
        } else {
            return (
                <div>
                    <button className={this.state.currentActivity === "run" ? "selectedButton" : "nonSelectedButton"} onClick={() => this.setActivity("run")}>Run</button>
                    <button className={this.state.currentActivity === "cycle" ? "selectedButton" : "nonSelectedButton"} onClick={() => this.setActivity("cycle")}>Cycle</button>

                    <table className="myTable">
                        <thead>
                            <tr>{this.getHeader(this.state.tableHeadSecond)}</tr>
                        </thead>
                        <tbody>
                            {this.state.currentActivity === "run" ?
                            userRows.allRuns.map(row => {
                                return (
                                    <tr>
                                        <td>{row.date}</td>
                                        <td>{row.activity}</td>
                                        <td>{row.distance} km</td>
                                        <td>{row.averageSpeed} min/km</td>
                                        <td>{row.movingTime} min</td>
                                        <td>{row.elevationGain} m</td>
                                    </tr>
                                )
                            }) :
                            userRows.allCycles.map(row => {
                                return (
                                    <tr>
                                        <td>{row.date}</td>
                                        <td>{row.activity}</td>
                                        <td>{row.distance} km</td>
                                        <td>{row.averageSpeed} km/h</td>
                                        <td>{row.movingTime} min</td>
                                        <td>{row.elevationGain} m</td>
                                    </tr>
                                )
                            })}
                        </tbody>
                    </table>
                </div>
            );
        }
    }

    render() {
        const { allRows } = this.props;

        const sortedRows = allRows.length > 0 ? allRows.sort((a,b) => a.totalPercent > b.totalPercent ? -1 : 1) : [];

        return (
            <div>
                <table className="myTable">
                    <thead>
                        <tr>{this.getHeader(this.state.tableHead)}</tr>
                    </thead>
                    <tbody>
                        {sortedRows.map((row, i) => {
                            return this.getRowsData(row, i)
                        })}
                    </tbody>
                </table>

                {this.detailedRows(sortedRows)}
            </div>
        )
    }
}

export default StravaTable;

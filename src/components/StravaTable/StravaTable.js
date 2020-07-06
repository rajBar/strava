import React, {Component} from 'react';
import './StravaTable-style.css';
import StravaChart from "../StravaChart/StravaChart";

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

    setUser(selectedUser) {
        const currentAthlete = this.state.user;
        const athlete = currentAthlete === selectedUser ? "" : selectedUser;

        this.setState({
            ...this.state,
            user: athlete,
        });
    }

    getRowsData(row, i) {
        const user = this.state.user;
        const name = row.name;
        const runNo = row.runQuantity;
        const runDistance = row.runDistance;
        const cycleNo = row.bikeQuantity;
        const cycleDistance = row.bikeDistance;
        const percentage = row.totalPercent;

        return (
            <tr className={user === name ? "selectedRow" : "selectableRow"} onClick={() => this.setUser(name)}>
                <td key={i} className="myTableContents">{name} {percentage == 100 ? "(completed)" : ""}</td>
                <td key={i} className="myTableContents">{runNo}</td>
                <td key={i} className="myTableContents">{runDistance} km</td>
                <td key={i} className="myTableContents">{cycleNo}</td>
                <td key={i} className="myTableContents">{cycleDistance} km</td>
            </tr>
        )
    }

    setActivity(activity){
        this.setState({
            ...this.state,
            currentActivity: activity,
        })
    }

    detailedRows(rows) {
        const user = this.state.user;

        let userRows;
        for (let i=0; i < rows.length; i++) {
            if (rows[i].name == user) {
                userRows = rows[i];
            }
        }

        if (user === "") {
            return <br />;
        } else {
            const rows = this.state.currentActivity === "run" ? userRows.allRuns : userRows.allCycles;
            return (
                <div>
                    <button className={this.state.currentActivity === "run" ? "selectedButton" : "nonSelectedButton"} onClick={() => this.setActivity("run")}>Run</button>
                    <button className={this.state.currentActivity === "cycle" ? "selectedButton" : "nonSelectedButton"} onClick={() => this.setActivity("cycle")}>Cycle</button>

                    <table className="myTable">
                        <thead>
                            <tr>{this.getHeader(this.state.tableHeadSecond)}</tr>
                        </thead>
                        <tbody>
                            {rows.map(row => {
                                return (
                                    <tr>
                                        <td>{row.date}</td>
                                        <td>{row.activity}</td>
                                        <td>{row.distance} km</td>
                                        <td>{row.averageSpeed} {this.state.currentActivity === "run" ? "min/km" : "km/h"}</td>
                                        <td>{row.movingTime} min</td>
                                        <td>{row.elevationGain} m</td>
                                    </tr>
                                )
                            })}
                        </tbody>
                    </table>
                    <StravaChart activity={this.state.currentActivity} rows={rows} />
                </div>
            );
        }
    }

    render() {
        const { allRows } = this.props;

        return (
            <div>
                <table className="myTable">
                    <thead>
                        <tr>{this.getHeader(this.state.tableHead)}</tr>
                    </thead>
                    <tbody>
                        {allRows.map((row, i) => {
                            return this.getRowsData(row, i)
                        })}
                    </tbody>
                </table>

                {this.detailedRows(allRows)}
            </div>
        )
    }
}

export default StravaTable;

import React, {Component} from 'react';
import './MonthTable-style.css';
import StravaChart from "../StravaChart/StravaChart";

class MonthTable extends Component {
    constructor(props) {
        super(props);
        this.state = {
            tableHead: [
                'Name',
                'No. Runs',
                'Run Distance',
                'No. Cycles',
                'Cycle Distance',
                'Total Complete',
            ],
            tableHeadSecond: [
                'Date',
                'Activity',
                'Distance',
                'Average Speed',
                'Activity Time',
                'Elevation Gain',
            ],
            competitionDistance: {
                run: 30,
                cycle: 100,
            },
            currentActivity: "run",
            user: "",
            unit: "km",
        };
    }

    getHeader(headers) {
        return headers.map((header, i) => {
            return <th className="myTableHeaders">{header}</th>
        });
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
        const runDistanceMile = row.runDistanceMile;
        const cycleNo = row.bikeQuantity;
        const cycleDistance = row.bikeDistance;
        const cycleDistanceMile = row.bikeDistanceMile;
        const percentage = row.totalPercent;
        const unit = this.state.unit;

        return (
            <tr className={user === name ? "selectedRow" : "selectableRow"} onClick={() => this.setUser(name)}>
                <td key={i} className="myTableContents">{name} {percentage == 100 ? "(completed)" : ""}</td>
                <td key={i} className="myTableContents">{runNo}</td>
                <td key={i} className="myTableContents">{unit === "km" ? runDistance + "km" : runDistanceMile + "miles"}</td>
                <td key={i} className="myTableContents">{cycleNo}</td>
                <td key={i} className="myTableContents">{unit === "km" ? cycleDistance + "km" : cycleDistanceMile + "miles"}</td>
                <td key={i} className="myTableContents">{this.calculateTotalPercent(runDistance, cycleDistance)}%</td>
            </tr>
        )
    }

    setActivity(activity){
        this.setState({
            ...this.state,
            currentActivity: activity,
        })
    }

    setUnit(unit){
        this.setState({
            ...this.state,
            unit: unit,
        })
    }

    calculateTotalPercent(runDistance, cycleDistance) {
        const competitionRun = this.state.competitionDistance.run;
        const competitionCycle = this.state.competitionDistance.cycle;

        const runPercentageCapped = runDistance > competitionRun ? 100 : (runDistance / competitionRun) * 100;
        const runPercentage = (runDistance / competitionRun) * 100;
        const cyclePercentageCapped = cycleDistance > competitionCycle ? 100 : (cycleDistance / competitionCycle) * 100;
        const cyclePercentage = (cycleDistance / competitionCycle) * 100;


        const totalPercentage =  (runPercentageCapped + cyclePercentageCapped) / 2 === 100 ? (runPercentage + cyclePercentage) / 2 : (runPercentageCapped + cyclePercentageCapped) / 2;

        return totalPercentage.toFixed(2);
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

                    {rows.length > 0 ?
                        (<div>
                            <StravaChart activity={this.state.currentActivity} rows={rows} unit={this.state.unit}/>

                            <table className="myTableTwo">
                                <thead>
                                <tr>{this.getHeader(this.state.tableHeadSecond)}</tr>
                                </thead>
                                <tbody>
                                {rows.map(row => {
                                    const unit = this.state.unit;
                                    const singleUnit = unit === "km" ? "km" : "mile";
                                    const speedUnit = unit === "km" ? "k" : "m";
                                    return (
                                        <tr>
                                            <td>{row.date}</td>
                                            <td>{row.activity}</td>
                                            <td>{unit === "km" ? row.distance + " km" : row.distanceMile + " miles"}</td>
                                            <td>{unit === "km" ? row.averageSpeed : row.averageSpeedMile} {this.state.currentActivity === "run" ? "min/" + singleUnit : speedUnit + "ph"}</td>
                                            <td>{row.movingTime} min</td>
                                            <td>{row.elevationGain} m</td>
                                        </tr>
                                    )
                                })}
                                </tbody>
                            </table>
                        </div>) : <h6 style={{paddingTop: '20px'}}>{this.state.user} is yet to {this.state.currentActivity} in {this.props.thisMonth}</h6>
                    }
                </div>
            );
        }
    }

    render() {
        let { allRows } = this.props;

        return (
            <div>
                <h7>Run {this.state.competitionDistance.run} km  &  Cycle {this.state.competitionDistance.cycle} km</h7>
                <br />
                <button className={this.state.unit === "km" ? "selectedButton" : "nonSelectedButton"} onClick={() => this.setUnit("km")}>Km</button>
                <button className={this.state.unit === "miles" ? "selectedButton" : "nonSelectedButton"} onClick={() => this.setUnit("miles")}>Miles</button>

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

export default MonthTable;

import React, {Component} from 'react';
import {Link} from "react-router-dom";
import {isMobile} from 'react-device-detect';
import './MonthTable-style.css';
import StravaChart from "../../containers/StravaChart";
import {COMPETITION_DISTANCE, DATE, THIS_MONTH} from "../../utils/consts";

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
            currentActivity: "run",
            unit: "km",
        };
    }

    getHeader(headers) {
        return headers.map((header) => {
            return <th className={isMobile ? "myTableHeadersMobile" : "myTableHeaders"}>{header}</th>
        });
    }

    singleSetUser(user) {
        const { currentUser, setCurrentUser } = this.props;

        if (user !== currentUser) {
            setCurrentUser(user);
        }
    }

    setUser(selectedUser) {
        const { currentUser, setCurrentUser } = this.props;
        const currentURL = window.location.href;
        const urlArr = currentURL.split('/');
        const name = urlArr[urlArr.length - 1];
        const userNames = this.props.userNames;
        if (userNames.includes(name) && (name !== selectedUser)) {
            window.location = window.location.href.replace(name, '');
        }

        const athlete = currentUser === selectedUser ? "" : selectedUser;

        setCurrentUser(athlete);
    }

    getRowsData(row, i) {
        const { currentUser } = this.props;
        const name = row.name;
        const runNo = row.runQuantity;
        const runDistance = isMobile ? row.runDistance.toFixed(1) : row.runDistance;
        const runDistanceMile = isMobile ? parseFloat(row.runDistanceMile).toFixed(1) : row.runDistanceMile;
        const cycleNo = row.bikeQuantity;
        const cycleDistance = isMobile ? row.bikeDistance.toFixed(1) : row.bikeDistance;
        const cycleDistanceMile = isMobile ? parseFloat(row.bikeDistanceMile).toFixed(1) : row.bikeDistanceMile;
        const percentage = row.totalPercentage;
        const unit = this.state.unit;

        return (
            <tr className={currentUser === name ? "selectedRow" : "selectableRow"} onClick={() => this.setUser(name)}>
                {percentage >= 100 ?
                    <td key={i} className="myTableContents-complete">{name} (completed)</td>
                    : <td key={i} className="myTableContents"><Link className="hidden-link" to={`/strava-competition/${name}`}>{name}</Link></td>
                }
                <td key={i} className="myTableContents">{runNo}</td>
                <td key={i} className="myTableContents">{unit === "km" ? runDistance + "km" : runDistanceMile + "miles"}</td>
                <td key={i} className="myTableContents">{cycleNo}</td>
                <td key={i} className="myTableContents">{unit === "km" ? cycleDistance + "km" : cycleDistanceMile + "miles"}</td>
                <td key={i} className="myTableContents">{percentage.toFixed(2)}%</td>
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

    detailedRows(rows) {
        const { currentUser } = this.props;

        let userRows;
        for (let i=0; i < rows.length; i++) {
            if (rows[i].name == currentUser) {
                userRows = rows[i];
            }
        }

        if (currentUser === "") {
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
                        </div>) : <h6 style={{paddingTop: '20px'}}>{currentUser} is yet to {this.state.currentActivity} in {this.props.thisMonth}</h6>
                    }
                </div>
            );
        }
    }

    render() {
        let { allRows } = this.props;
        const monthIndex = DATE.getMonth() + 1;

        const currentURL = window.location.href;
        const urlArr = currentURL.split('/');
        const name = urlArr[urlArr.length - 1];
        const userNames = this.props.userNames;
        if (userNames.includes(name)) {
            this.singleSetUser(name);
        }

        return (
            <div>
                <h4>Jan - {THIS_MONTH} Competition</h4>
                <h6>Run {COMPETITION_DISTANCE.run * monthIndex} km  &  Cycle {COMPETITION_DISTANCE.cycle * monthIndex} km</h6>
                <p style={{fontSize: "11px", padding: 0}}>({COMPETITION_DISTANCE.run} km & {COMPETITION_DISTANCE.cycle} km a month)</p>
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

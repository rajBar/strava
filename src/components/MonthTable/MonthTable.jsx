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
        const { currentUser, activityUnit } = this.props;
        const name = row.name;
        const runNo = row.runQuantity;
        const runDistance = isMobile ? row.runDistance.toFixed(1) : row.runDistance;
        const runDistanceMile = isMobile ? parseFloat(row.runDistanceMile).toFixed(1) : row.runDistanceMile;
        const cycleNo = row.bikeQuantity;
        const cycleDistance = isMobile ? row.bikeDistance.toFixed(1) : row.bikeDistance;
        const cycleDistanceMile = isMobile ? parseFloat(row.bikeDistanceMile).toFixed(1) : row.bikeDistanceMile;
        const percentage = row.totalPercentage;

        return (
            <tr className={currentUser === name ? "selectedRow" : "selectableRow"} onClick={() => this.setUser(name)}>
                {percentage >= 100 ?
                    <td key={i} className="myTableContents-complete">{name} (completed)</td>
                    : <td key={i} className="myTableContents"><Link className="hidden-link" to={`/strava-competition/${name}`}>{name}</Link></td>
                }
                <td key={i} className="myTableContents">{runNo}</td>
                <td key={i} className="myTableContents">{activityUnit === "km" ? runDistance + "km" : runDistanceMile + "miles"}</td>
                <td key={i} className="myTableContents">{cycleNo}</td>
                <td key={i} className="myTableContents">{activityUnit === "km" ? cycleDistance + "km" : cycleDistanceMile + "miles"}</td>
                <td key={i} className="myTableContents">{percentage.toFixed(2)}%</td>
            </tr>
        )
    }

    detailedRows() {
        const { currentUser, currentActivityType, setCurrentActivityType, activityUnit, formattedUserActivityForCurrentYear } = this.props;

        if (currentUser === "") {
            return <br />;
        } else {
            const activityRows = currentActivityType === "run" ? formattedUserActivityForCurrentYear.allRuns : formattedUserActivityForCurrentYear.allCycles;
            return (
                <div>
                    <button className={currentActivityType === "run" ? "selectedButton" : "nonSelectedButton"} onClick={() => setCurrentActivityType("run")}>Run</button>
                    <button className={currentActivityType === "cycle" ? "selectedButton" : "nonSelectedButton"} onClick={() => setCurrentActivityType("cycle")}>Cycle</button>

                    {activityRows.length > 0 ?
                        (<div>
                            <StravaChart rows={activityRows} />

                            <table className="myTableTwo">
                                <thead>
                                <tr>{this.getHeader(this.state.tableHeadSecond)}</tr>
                                </thead>
                                <tbody>
                                {activityRows.map(row => {
                                    const singleUnit = activityUnit === "km" ? "km" : "mile";
                                    const speedUnit = activityUnit === "km" ? "k" : "m";
                                    return (
                                        <tr>
                                            <td>{row.date}</td>
                                            <td>{row.activity}</td>
                                            <td>{activityUnit === "km" ? row.distance + " km" : row.distanceMile + " miles"}</td>
                                            <td>{activityUnit === "km" ? row.averageSpeed : row.averageSpeedMile} {currentActivityType === "run" ? "min/" + singleUnit : speedUnit + "ph"}</td>
                                            <td>{row.movingTime} min</td>
                                            <td>{row.elevationGain} m</td>
                                        </tr>
                                    )
                                })}
                                </tbody>
                            </table>
                        </div>) : <h6 style={{paddingTop: '20px'}}>{currentUser} is yet to {currentActivityType} in {this.props.thisMonth}</h6>
                    }
                </div>
            );
        }
    }

    render() {
        let { allRows, activityUnit, setActivityUnit } = this.props;
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
                <button className={activityUnit === "km" ? "selectedButton" : "nonSelectedButton"} onClick={() => setActivityUnit("km")}>Km</button>
                <button className={activityUnit === "miles" ? "selectedButton" : "nonSelectedButton"} onClick={() => setActivityUnit("miles")}>Miles</button>

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

                {this.detailedRows()}
            </div>
        )
    }
}

export default MonthTable;

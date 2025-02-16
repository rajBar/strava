import React, {Component} from 'react';
import {Link} from "react-router-dom";
import {isMobile} from 'react-device-detect';
import './YearTable-style.css';
import StravaChart from "../../containers/StravaChart";
import {COMPETITION_DISTANCE, DATE, THIS_MONTH} from "../../utils/consts";

class YearTable extends Component {
    constructor(props) {
        super(props);
        this.state = {
            tableHead: [
                'Name',
                'No. Runs',
                'Run Distance',
                'No. Cycles',
                'Cycle Distance',
                'No. Swims',
                'Swim Distance',
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
            tableHeadSwim: [
                'Date',
                'Activity',
                'Distance',
                'Average Speed',
                'Activity Time',
            ],
        };
        this.handleYearChange = this.handleYearChange.bind(this)
    }

    handleYearChange(event) {
        let { setSelectedYear } = this.props;
        const selectedValue = event.target.value;
        setSelectedYear(selectedValue);
    };

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
        const runDistance = isMobile ? parseFloat(row.runDistance).toFixed(1) : row.runDistance;
        const runDistanceMile = isMobile ? parseFloat(row.runDistanceMile).toFixed(1) : row.runDistanceMile;
        const cycleDistance = isMobile ? parseFloat(row.bikeDistance).toFixed(1) : row.bikeDistance;
        const cycleDistanceMile = isMobile ? parseFloat(row.bikeDistanceMile).toFixed(1) : row.bikeDistanceMile;
        const swimDistance = isMobile ? parseFloat(row.swimDistance).toFixed(1) : row.swimDistance;
        const swimDistanceMile = isMobile ? parseFloat(row.swimDistanceMile).toFixed(1) : row.swimDistanceMile;
        const percentage = row.totalPercentage;

        return (
            <tr className={currentUser === name ? "selectedRow" : "selectableRow"} onClick={() => this.setUser(name)}>
                {percentage >= 100 ?
                    <td key={i} className="myTableContents-complete">{name} (completed)</td>
                    : <td key={i} className="myTableContents"><Link className="hidden-link" to={`/strava-competition/${name}`}>{name}</Link></td>
                }
                <td key={i} className="myTableContents">{row.runQuantity}</td>
                <td key={i} className="myTableContents">{activityUnit === "km" ? runDistance + "km" : runDistanceMile + "miles"}</td>
                <td key={i} className="myTableContents">{row.bikeQuantity}</td>
                <td key={i} className="myTableContents">{activityUnit === "km" ? cycleDistance + "km" : cycleDistanceMile + "miles"}</td>
                <td key={i} className="myTableContents">{row.swimQuantity}</td>
                <td key={i} className="myTableContents">{activityUnit === "km" ? swimDistance + "km" : swimDistanceMile + "miles"}</td>
                <td key={i} className="myTableContents">{percentage.toFixed(2)}%</td>
            </tr>
        )
    }

    detailedRows() {
        const { currentUser, currentActivityType, setCurrentActivityType, activityUnit, formattedUserSpecificActivityForCurrentYear, selectedYear } = this.props;
        const currentYear = new Date().getFullYear();

        if (currentUser === "") {
            return <br />;
        } else {
            return (
                <div>
                    <button className={currentActivityType === "run" ? "selectedButton" : "nonSelectedButton"} onClick={() => setCurrentActivityType("run")}>Run</button>
                    <button className={currentActivityType === "cycle" ? "selectedButton" : "nonSelectedButton"} onClick={() => setCurrentActivityType("cycle")}>Cycle</button>
                    <button className={currentActivityType === "swim" ? "selectedButton" : "nonSelectedButton"} onClick={() => setCurrentActivityType("swim")}>Swim</button>

                    {formattedUserSpecificActivityForCurrentYear.length > 0 ?
                        (<div>
                            <StravaChart currentYear={true} />

                            <table className="myTableTwo">
                                <thead>
                                <tr>{this.getHeader(this.state.tableHeadSecond)}</tr>
                                </thead>
                                <tbody>
                                {formattedUserSpecificActivityForCurrentYear.map(row => {
                                    const singleUnit = activityUnit === "km" ? "km" : "mile";
                                    const speedUnit = activityUnit === "km" ? "k" : "m";
                                    const swimSpeedUnit = activityUnit === "km" ? "100m" : "100y";
                                    return (
                                        <tr>
                                            <td>{row.date}</td>
                                            <td>{row.activity}</td>
                                            <td>{activityUnit === "km" ?
                                                    row.distance + (currentActivityType === "swim" ? "m" : " km") :
                                                    row.distanceMile + " miles"}
                                            </td>
                                            <td>{activityUnit === "km" ? row.averageSpeed : row.averageSpeedMile}
                                                {
                                                    currentActivityType === "cycle" ?
                                                        speedUnit + "ph" :
                                                        "min/" + (currentActivityType === "run" ?
                                                            singleUnit :
                                                            swimSpeedUnit)
                                                }
                                            </td>
                                            <td>{row.movingTime} min</td>
                                            <td>{row.elevationGain} m</td>
                                        </tr>
                                    )
                                })}
                                </tbody>
                            </table>
                        </div>) : currentYear === selectedYear ?
                                    <h6 style={{paddingTop: '20px'}}>{currentUser} is yet to {currentActivityType} this year</h6> :
                                    <h6 style={{paddingTop: '20px'}}>{currentUser} did not {currentActivityType} in {selectedYear}</h6>

                    }
                </div>
            );
        }
    }

    render() {
        let { allRows, activityUnit, setActivityUnit, selectedYear, earliestYear } = this.props;
        const monthIndex = DATE.getMonth() + 1;
        const currentYear = new Date().getFullYear();

        const currentURL = window.location.href;
        const urlArr = currentURL.split('/');
        const name = urlArr[urlArr.length - 1];
        const userNames = this.props.userNames;
        if (userNames.includes(name)) {
            this.singleSetUser(name);
        }

        return (
            <div>
                <select value={selectedYear} onChange={this.handleYearChange}>
                    {Array.from({ length: currentYear - earliestYear + 1 }, (_, index) => {
                      const year = currentYear - index;
                      return <option key={year} value={year}>{year}</option>;
                    })}
                </select>
                <br/>
                {
                    (selectedYear == currentYear) ?
                        <h4>Jan - {THIS_MONTH} Triathlon</h4>
                    :
                        <h4>{selectedYear} Triathlon</h4>
                }
                <h6>
                    Run {COMPETITION_DISTANCE.run * ((selectedYear == currentYear) ? monthIndex : 12)} km,
                    Cycle {COMPETITION_DISTANCE.cycle * ((selectedYear == currentYear) ? monthIndex : 12)} km &
                    Swim {COMPETITION_DISTANCE.swim * ((selectedYear == currentYear) ? monthIndex : 12)} km
                </h6>
                <p style={{fontSize: "11px", padding: 0}}>
                    ({COMPETITION_DISTANCE.run} km, {COMPETITION_DISTANCE.cycle} km & {COMPETITION_DISTANCE.swim} km a month)
                </p>
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

export default YearTable;

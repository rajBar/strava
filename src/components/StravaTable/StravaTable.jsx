import React, {Component} from 'react';
import './StravaTable-style.css';
import StravaChart from "../../containers/StravaChart";
import _ from 'lodash';
import {Link} from "react-router-dom";

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
            unit: "km",
            sort: {
                field: "date",
                direction: true
            },
        };
    }

    getHeader(headers, sorter) {
        return headers.map((header) => {
            if (sorter) {
                return <th className="myTableHeaders" onClick={() => this.setSort(header)}>{header}</th>
            } else {
                return <th className="myTableHeaders">{header}</th>
            }
        })
    }

    setSort(field) {
        const currentSort = this.state.sort;
        const newDirection = field === currentSort.field ? !currentSort.direction : true;

        this.setState({
            ...this.state,
            sort: {
                field: field,
                direction: newDirection
            }
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
        const runDistance = row.runDistance;
        const runDistanceMile = row.runDistanceMile;
        const cycleNo = row.bikeQuantity;
        const cycleDistance = row.bikeDistance;
        const cycleDistanceMile = row.bikeDistanceMile;
        const unit = this.state.unit;

        return (
            <tr className={currentUser === name ? "selectedRow" : "selectableRow"} onClick={() => this.setUser(name)}>
                <td key={i} className="myTableContents"><Link className="hidden-link" to={`/home/${name}`}>{name}</Link></td>
                <td key={i} className="myTableContents">{runNo}</td>
                <td key={i} className="myTableContents">{unit === "km" ? runDistance + "km" : runDistanceMile + "miles"}</td>
                <td key={i} className="myTableContents">{cycleNo}</td>
                <td key={i} className="myTableContents">{unit === "km" ? cycleDistance + "km" : cycleDistanceMile + "miles"}</td>
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
        const userNames = this.props.userNames;

        let userRows;
        for (let i=0; i < rows.length; i++) {
            if (rows[i].name == currentUser) {
                userRows = rows[i];
            }
        }

        if (!userNames.includes(currentUser)) {
            return <br />;
        } else {
            const rows = this.state.currentActivity === "run" ? userRows.allRuns : userRows.allCycles;
            return (
                <div>
                    <button className={this.state.currentActivity === "run" ? "selectedButton" : "nonSelectedButton"} onClick={() => this.setActivity("run")}>Run</button>
                    <button className={this.state.currentActivity === "cycle" ? "selectedButton" : "nonSelectedButton"} onClick={() => this.setActivity("cycle")}>Cycle</button>


                    {rows.length > 0 ?
                        (<div>
                            <StravaChart activity={this.state.currentActivity} rows={rows} unit={this.state.unit} />

                            <table className="myTableTwo">
                                <thead>
                                    <tr>{this.getHeader(this.state.tableHeadSecond, "sorting function")}</tr>
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
                        </div>) : <h6 style={{paddingTop: '20px'}}>{currentUser} is yet to {this.state.currentActivity}</h6>
                    }
                </div>
            );
        }
    }

    render() {
        let { allRows, orderedRows } = this.props;
        let sort = this.state.sort;

        const currentURL = window.location.href;
        const urlArr = currentURL.split('/');
        const name = urlArr[urlArr.length - 1];
        const userNames = this.props.userNames;
        if (userNames.includes(name)) {
            this.singleSetUser(name);
        }

        allRows.forEach(row => {
            if (sort.field === "Date") {
                allRows = [...orderedRows];
            } else if (sort.field === "Distance") {
                if (sort.direction) {
                    row.allRuns = _.orderBy(row.allRuns, function (o) { return Number(o.distance); }, 'asc');
                    row.allCycles = _.orderBy(row.allCycles, function (o) { return Number(o.distance); }, 'asc');
                } else {
                    row.allRuns = _.orderBy(row.allRuns, function (o) { return Number(o.distance); }, 'desc');
                    row.allCycles = _.orderBy(row.allCycles, function (o) { return Number(o.distance); }, 'desc');
                }
            } else if (sort.field === "Average Speed") {
                if (sort.direction) {
                    row.allRuns = _.orderBy(row.allRuns, 'averageSpeed', 'asc');
                    row.allCycles = _.orderBy(row.allCycles, 'averageSpeed', 'asc');
                } else {
                    row.allRuns = _.orderBy(row.allRuns, 'averageSpeed', 'desc');
                    row.allCycles = _.orderBy(row.allCycles, 'averageSpeed', 'desc');
                }
            } else if (sort.field === "Activity Time") {
                if (sort.direction) {
                    row.allRuns = _.orderBy(row.allRuns, 'movingTime', 'asc');
                    row.allCycles = _.orderBy(row.allCycles, 'movingTime', 'asc');
                } else {
                    row.allRuns = _.orderBy(row.allRuns, 'movingTime', 'desc');
                    row.allCycles = _.orderBy(row.allCycles, 'movingTime', 'desc');
                }
            } else if (sort.field === "Elevation Gain") {
                if (sort.direction) {
                    row.allRuns = _.orderBy(row.allRuns, 'elevationGain', 'asc');
                    row.allCycles = _.orderBy(row.allCycles, 'elevationGain', 'asc');
                } else {
                    row.allRuns = _.orderBy(row.allRuns, 'elevationGain', 'desc');
                    row.allCycles = _.orderBy(row.allCycles, 'elevationGain', 'desc');
                }
            }
        });

        return (
            <div>
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

export default StravaTable;

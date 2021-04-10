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
        const { currentUser, activityUnit } = this.props;
        const name = row.name;

        return (
            <tr className={currentUser === name ? "selectedRow" : "selectableRow"} onClick={() => this.setUser(name)}>
                <td key={i} className="myTableContents"><Link className="hidden-link" to={`/home/${name}`}>{name}</Link></td>
                <td key={i} className="myTableContents">{row.runQuantity}</td>
                <td key={i} className="myTableContents">{activityUnit === "km" ? row.runDistance + "km" : row.runDistanceMile + "miles"}</td>
                <td key={i} className="myTableContents">{row.bikeQuantity}</td>
                <td key={i} className="myTableContents">{activityUnit === "km" ? row.bikeDistance + "km" : row.bikeDistanceMile + "miles"}</td>
            </tr>
        )
    }

    detailedRows() {
        const { currentUser, currentActivityType, setCurrentActivityType, activityUnit, userNames } = this.props;

        const userRows = this.getSortedCurrentUserRows();

        if (!userNames.includes(currentUser)) {
            return <br />;
        } else {
            const rows = currentActivityType === "run" ? userRows.allRuns : userRows.allCycles;
            return (
                <div>
                    <button className={currentActivityType === "run" ? "selectedButton" : "nonSelectedButton"} onClick={() => setCurrentActivityType("run")}>Run</button>
                    <button className={currentActivityType === "cycle" ? "selectedButton" : "nonSelectedButton"} onClick={() => setCurrentActivityType("cycle")}>Cycle</button>


                    {rows.length > 0 ?
                        (<div>
                            <StravaChart rows={rows} />

                            <table className="myTableTwo">
                                <thead>
                                    <tr>{this.getHeader(this.state.tableHeadSecond, "sorting function")}</tr>
                                </thead>
                                <tbody>
                                    {rows.map(row => {
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
                        </div>) : <h6 style={{paddingTop: '20px'}}>{currentUser} is yet to {currentActivityType}</h6>
                    }
                </div>
            );
        }
    }

    getSortedCurrentUserRows() {
        const { formattedUserActivity } = this.props
        let userActivity = {...formattedUserActivity};
        const { sort } = this.state;


        if (sort.field === "Date") {
            userActivity = {...formattedUserActivity};
        } else if (sort.field === "Distance") {
            if (sort.direction) {
                userActivity.allRuns = _.orderBy(userActivity.allRuns, function (o) { return Number(o.distance); }, 'asc');
                userActivity.allCycles = _.orderBy(userActivity.allCycles, function (o) { return Number(o.distance); }, 'asc');
            } else {
                userActivity.allRuns = _.orderBy(userActivity.allRuns, function (o) { return Number(o.distance); }, 'desc');
                userActivity.allCycles = _.orderBy(userActivity.allCycles, function (o) { return Number(o.distance); }, 'desc');
            }
        } else if (sort.field === "Average Speed") {
            if (sort.direction) {
                userActivity.allRuns = _.orderBy(userActivity.allRuns, o => { return Number(o.averageSpeed) }, 'asc');
                userActivity.allCycles = _.orderBy(userActivity.allCycles, o => { return Number(o.averageSpeed) }, 'asc');
            } else {
                userActivity.allRuns = _.orderBy(userActivity.allRuns, o => { return Number(o.averageSpeed) }, 'desc');
                userActivity.allCycles = _.orderBy(userActivity.allCycles, o => { return Number(o.averageSpeed) }, 'desc');
            }
        } else if (sort.field === "Activity Time") {
            if (sort.direction) {
                userActivity.allRuns = _.orderBy(userActivity.allRuns, 'movingTime', 'asc');
                userActivity.allCycles = _.orderBy(userActivity.allCycles, 'movingTime', 'asc');
            } else {
                userActivity.allRuns = _.orderBy(userActivity.allRuns, 'movingTime', 'desc');
                userActivity.allCycles = _.orderBy(userActivity.allCycles, 'movingTime', 'desc');
            }
        } else if (sort.field === "Elevation Gain") {
            if (sort.direction) {
                userActivity.allRuns = _.orderBy(userActivity.allRuns, 'elevationGain', 'asc');
                userActivity.allCycles = _.orderBy(userActivity.allCycles, 'elevationGain', 'asc');
            } else {
                userActivity.allRuns = _.orderBy(userActivity.allRuns, 'elevationGain', 'desc');
                userActivity.allCycles = _.orderBy(userActivity.allCycles, 'elevationGain', 'desc');
            }
        }

        return userActivity;
    }

    render() {
        const { allRows, activityUnit, setActivityUnit } = this.props;

        const currentURL = window.location.href;
        const urlArr = currentURL.split('/');
        const name = urlArr[urlArr.length - 1];
        const userNames = this.props.userNames;
        if (userNames.includes(name)) {
            this.singleSetUser(name);
        }

        return (
            <div>
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

export default StravaTable;

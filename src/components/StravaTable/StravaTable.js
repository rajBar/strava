import React, {Component} from 'react';

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
        // const headers = this.state.tableHead;
        return headers.map((header, i) => {
            return <th key={i} style={{padding: "5px 10px", borderBottom: "1px solid black"}}>{header}</th>
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
                <td key={i} style={{padding: "5px 0", borderBottom: "1px solid black"}}>{name} {percentage == 100 ? "(completed)" : ""}</td>
                <td key={i} style={{padding: "5px 0", borderBottom: "1px solid black"}}>{runNo}</td>
                <td key={i} style={{padding: "5px 0", borderBottom: "1px solid black"}}>{runDistance} km</td>
                <td key={i} style={{padding: "5px 0", borderBottom: "1px solid black"}}>{cycleNo}</td>
                <td key={i} style={{padding: "5px 0", borderBottom: "1px solid black"}}>{cycleDistance} km</td>
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
                    <button style={{color: "black", backgroundColour: "white", border: "2px solid #808080", marginTop: "10px", marginRight: "5px"}} onClick={() => this.setActivity("run")}>Run</button>
                    <button style={{color: "black", backgroundColour: "white", border: "2px solid #808080", marginTop: "10px", marginLeft: "5px"}} onClick={() => this.setActivity("cycle")}>Cycle</button>

                    <table style={{marginLeft: "auto", marginRight: "auto", marginTop: "5px", border: "1px solid black"}}>
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
                <table style={{marginLeft: "auto", marginRight: "auto", marginTop: "20px", border: "1px solid black"}}>
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

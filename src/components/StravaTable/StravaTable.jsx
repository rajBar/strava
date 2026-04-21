import React, {Component} from 'react';
import StravaChart from "../../containers/StravaChart";
import { Table, Radio, Space, Typography, Empty, Card } from 'antd';
import { UserOutlined, DashboardOutlined, ThunderboltOutlined, TrophyOutlined } from '@ant-design/icons';
import { Link } from "react-router-dom";

const { Title } = Typography;

class StravaTable extends Component {
    constructor(props) {
        super(props);
        this.state = {
            sort: {
                field: "date",
                direction: true
            },
        };
    }

    singleSetUser(user) {
        const { currentUser, setCurrentUser } = this.props;
        if (user !== currentUser) {
            setCurrentUser(user);
        }
    }

    setUser(selectedUser) {
        const { currentUser, setCurrentUser } = this.props;
        const athlete = currentUser === selectedUser ? "" : selectedUser;
        setCurrentUser(athlete);
    }

    getSummaryColumns() {
        const { activityUnit } = this.props;
        const unit = activityUnit === "km" ? "km" : "miles";

        return [
            {
                title: <span><UserOutlined /> Name</span>,
                dataIndex: 'name',
                key: 'name',
                render: (text) => <Link to={`/home/${text}`} style={{ fontWeight: 500 }}>{text}</Link>,
                sorter: (a, b) => a.name.localeCompare(b.name),
            },
            {
                title: <span><ThunderboltOutlined /> Runs</span>,
                dataIndex: 'runQuantity',
                key: 'runQuantity',
                sorter: (a, b) => a.runQuantity - b.runQuantity,
                align: 'center',
            },
            {
                title: `Run Dist (${unit})`,
                key: 'runDistance',
                render: (_, record) => activityUnit === "km" ? record.runDistance : record.runDistanceMile,
                sorter: (a, b) => activityUnit === "km" ? a.runDistance - b.runDistance : a.runDistanceMile - b.runDistanceMile,
                align: 'right',
            },
            {
                title: <span><DashboardOutlined /> Cycles</span>,
                dataIndex: 'bikeQuantity',
                key: 'bikeQuantity',
                sorter: (a, b) => a.bikeQuantity - b.bikeQuantity,
                align: 'center',
            },
            {
                title: `Cycle Dist (${unit})`,
                key: 'bikeDistance',
                render: (_, record) => activityUnit === "km" ? record.bikeDistance : record.bikeDistanceMile,
                sorter: (a, b) => activityUnit === "km" ? a.bikeDistance - b.bikeDistance : a.bikeDistanceMile - b.bikeDistanceMile,
                align: 'right',
            },
            {
                title: <span><TrophyOutlined /> Swims</span>,
                dataIndex: 'swimQuantity',
                key: 'swimQuantity',
                sorter: (a, b) => a.swimQuantity - b.swimQuantity,
                align: 'center',
            },
            {
                title: `Swim Dist (${unit})`,
                key: 'swimDistance',
                render: (_, record) => activityUnit === "km" ? record.swimDistance : record.swimDistanceMile,
                sorter: (a, b) => activityUnit === "km" ? a.swimDistance - b.swimDistance : a.swimDistanceMile - b.swimDistanceMile,
                align: 'right',
            },
        ];
    }

    getDetailedColumns() {
        const { currentActivityType, activityUnit } = this.props;
        const singleUnit = activityUnit === "km" ? "km" : "mile";
        const speedUnit = activityUnit === "km" ? "k" : "m";
        const swimSpeedUnit = activityUnit === "km" ? "100m" : "100y";

        const cols = [
            {
                title: 'Date',
                dataIndex: 'date',
                key: 'date',
                sorter: (a, b) => {
                    const parseDate = (d) => {
                        const parts = d.split('/');
                        return new Date(2000 + parseInt(parts[2]), parts[1] - 1, parts[0]);
                    };
                    return parseDate(a.date) - parseDate(b.date);
                },
            },
            {
                title: 'Activity',
                dataIndex: 'activity',
                key: 'activity',
            },
            {
                title: `Distance (${activityUnit === "km" && currentActivityType === "swim" ? "m" : singleUnit})`,
                key: 'distance',
                render: (_, record) => {
                    if (activityUnit === "km") {
                        return record.distance + (currentActivityType === "swim" ? "m" : " km");
                    }
                    return record.distanceMile + " miles";
                },
                sorter: (a, b) => activityUnit === "km" ? a.distance - b.distance : a.distanceMile - b.distanceMile,
            },
            {
                title: 'Average Speed',
                key: 'averageSpeed',
                render: (_, record) => {
                    const speed = activityUnit === "km" ? record.averageSpeed : record.averageSpeedMile;
                    const unitStr = currentActivityType === "cycle" ? 
                                    speedUnit + "ph" : 
                                    "min/" + (currentActivityType === "run" ? singleUnit : swimSpeedUnit);
                    return `${speed} ${unitStr}`;
                },
                sorter: (a, b) => activityUnit === "km" ? a.averageSpeed - b.averageSpeed : a.averageSpeedMile - b.averageSpeedMile,
            },
            {
                title: 'Time (min)',
                dataIndex: 'movingTime',
                key: 'movingTime',
                sorter: (a, b) => a.movingTime - b.movingTime,
            },
        ];

        if (currentActivityType !== "swim") {
            cols.push({
                title: 'Elevation (m)',
                dataIndex: 'elevationGain',
                key: 'elevationGain',
                sorter: (a, b) => a.elevationGain - b.elevationGain,
            });
        }

        return cols;
    }

    render() {
        const { 
            allRows, 
            activityUnit, 
            setActivityUnit, 
            currentUser, 
            currentActivityType, 
            setCurrentActivityType,
            currentUserCurrentActivityData,
            userNames,
            isDarkMode
        } = this.props;

        const currentURL = window.location.href;
        const urlArr = currentURL.split('/');
        const nameInUrl = urlArr[urlArr.length - 1];
        if (userNames.includes(nameInUrl)) {
            this.singleSetUser(nameInUrl);
        }

        return (
            <Space direction="vertical" size="large" style={{ width: '100%' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                    <Title level={4} style={{ margin: 0 }}>Activity Overview</Title>
                    <Radio.Group value={activityUnit} onChange={(e) => setActivityUnit(e.target.value)} buttonStyle="solid">
                        <Radio.Button value="km">Metric (km)</Radio.Button>
                        <Radio.Button value="miles">Imperial (miles)</Radio.Button>
                    </Radio.Group>
                </div>

                <Table 
                    columns={this.getSummaryColumns()} 
                    dataSource={allRows} 
                    rowKey="name"
                    pagination={false}
                    onRow={(record) => ({
                        onClick: () => this.setUser(record.name),
                        style: { cursor: 'pointer' }
                    })}
                    rowClassName={(record) => record.name === currentUser ? 'ant-table-row-selected' : ''}
                    size="middle"
                    bordered
                />

                {userNames.includes(currentUser) ? (
                    <Card style={{ marginTop: '20px', border: '1px solid #f0f0f0' }}>
                        <Space direction="vertical" size="middle" style={{ width: '100%' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <Title level={4} style={{ margin: 0 }}>{currentUser}'s Detailed Stats</Title>
                                <Radio.Group value={currentActivityType} onChange={(e) => setCurrentActivityType(e.target.value)} buttonStyle="solid">
                                    <Radio.Button value="run">Run</Radio.Button>
                                    <Radio.Button value="cycle">Cycle</Radio.Button>
                                    <Radio.Button value="swim">Swim</Radio.Button>
                                </Radio.Group>
                            </div>

                            {currentUserCurrentActivityData && currentUserCurrentActivityData.length > 0 ? (
                                <>
                                    <div style={{ background: isDarkMode ? '#1f1f1f' : '#fafafa', padding: '20px', borderRadius: '8px', marginBottom: '20px' }}>
                                        <StravaChart isDarkMode={isDarkMode} />
                                    </div>
                                    <Table 
                                        columns={this.getDetailedColumns()} 
                                        dataSource={currentUserCurrentActivityData} 
                                        rowKey={(record) => record.date + record.distance}
                                        pagination={{ pageSize: 1000, hideOnSinglePage: true }}
                                        size="small"
                                    />
                                </>
                            ) : (
                                <Empty description={<span>{currentUser} has no {currentActivityType} data available.</span>} />
                            )}
                        </Space>
                    </Card>
                ) : null}
            </Space>
        );
    }
}

export default StravaTable;

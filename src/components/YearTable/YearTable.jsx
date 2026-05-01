import React, {Component} from 'react';
import StravaChart from "../../containers/StravaChart";
import { Table, Select, Radio, Space, Typography, Card, Progress, Tag, Empty } from 'antd';
import { TrophyOutlined, CalendarOutlined } from '@ant-design/icons';
import { Link } from "react-router-dom";
import { COMPETITION_DISTANCE, DATE, THIS_MONTH } from "../../utils/consts";

const { Title, Text, Paragraph } = Typography;
const { Option } = Select;

class YearTable extends Component {
    componentDidMount() {
        this.checkUrlForUser();
    }

    componentDidUpdate(prevProps) {
        if (this.props.location.pathname !== prevProps.location.pathname) {
            this.checkUrlForUser();
        }
    }

    checkUrlForUser() {
        const { userNames } = this.props;
        const currentURL = window.location.href;
        const urlArr = currentURL.split('/');
        const nameInUrl = urlArr[urlArr.length - 1];
        if (userNames.includes(nameInUrl)) {
            this.singleSetUser(nameInUrl);
        }
    }

    handleYearChange = (value) => {
        let { setSelectedYear } = this.props;
        setSelectedYear(value);
    };

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
                title: 'Name',
                dataIndex: 'name',
                key: 'name',
                render: (text, record) => (
                    <Space>
                        <Link to={`/strava-competition/${text}`}>{text}</Link>
                        {record.totalPercentage >= 100 && <Tag color="gold" icon={<TrophyOutlined />}>Winner</Tag>}
                    </Space>
                ),
                sorter: (a, b) => a.name.localeCompare(b.name),
            },
            {
                title: 'Runs',
                dataIndex: 'runQuantity',
                key: 'runQuantity',
                sorter: (a, b) => a.runQuantity - b.runQuantity,
            },
            {
                title: `Run Dist (${unit})`,
                key: 'runDistance',
                render: (_, record) => activityUnit === "km" ? record.runDistance : record.runDistanceMile,
                sorter: (a, b) => {
                    const valA = activityUnit === "km" ? a.runDistance : a.runDistanceMile;
                    const valB = activityUnit === "km" ? b.runDistance : b.runDistanceMile;
                    return Number(valA) - Number(valB);
                },
            },
            {
                title: 'Cycles',
                dataIndex: 'bikeQuantity',
                key: 'bikeQuantity',
                sorter: (a, b) => a.bikeQuantity - b.bikeQuantity,
            },
            {
                title: `Cycle Dist (${unit})`,
                key: 'bikeDistance',
                render: (_, record) => activityUnit === "km" ? record.bikeDistance : record.bikeDistanceMile,
                sorter: (a, b) => {
                    const valA = activityUnit === "km" ? a.bikeDistance : a.bikeDistanceMile;
                    const valB = activityUnit === "km" ? b.bikeDistance : b.bikeDistanceMile;
                    return Number(valA) - Number(valB);
                },
            },
            {
                title: 'Swims',
                dataIndex: 'swimQuantity',
                key: 'swimQuantity',
                sorter: (a, b) => a.swimQuantity - b.swimQuantity,
            },
            {
                title: `Swim Dist (${unit})`,
                key: 'swimDistance',
                render: (_, record) => activityUnit === "km" ? record.swimDistance : record.swimDistanceMile,
                sorter: (a, b) => {
                    const valA = activityUnit === "km" ? a.swimDistance : a.swimDistanceMile;
                    const valB = activityUnit === "km" ? b.swimDistance : b.swimDistanceMile;
                    return Number(valA) - Number(valB);
                },
            },
            {
                title: 'Completion',
                dataIndex: 'totalPercentage',
                key: 'totalPercentage',
                render: (percent) => (
                    <div style={{ width: 120 }}>
                        <Progress percent={parseFloat(percent.toFixed(1))} size="small" status={percent >= 100 ? 'success' : 'active'} strokeColor={percent >= 100 ? '#52c41a' : '#fc4c02'} />
                    </div>
                ),
                sorter: (a, b) => a.totalPercentage - b.totalPercentage,
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
                defaultSortOrder: 'descend',
            },
            {
                title: 'Activity',
                dataIndex: 'activity',
                key: 'activity',
                sorter: (a, b) => a.activity.localeCompare(b.activity),
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
                sorter: (a, b) => {
                    const valA = activityUnit === "km" ? a.distance : a.distanceMile;
                    const valB = activityUnit === "km" ? b.distance : b.distanceMile;
                    return Number(valA) - Number(valB);
                },
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
                sorter: (a, b) => {
                    const valA = activityUnit === "km" ? a.averageSpeed : a.averageSpeedMile;
                    const valB = activityUnit === "km" ? b.averageSpeed : b.averageSpeedMile;
                    return Number(valA) - Number(valB);
                },
            },
            {
                title: 'Time (min)',
                dataIndex: 'movingTime',
                key: 'movingTime',
                sorter: (a, b) => Number(a.movingTime) - Number(b.movingTime),
            },
            {
                title: 'Elevation (m)',
                dataIndex: 'elevationGain',
                key: 'elevationGain',
                sorter: (a, b) => Number(a.elevationGain) - Number(b.elevationGain),
            },
        ];

        return cols;
    }

    render() {
        let { allRows, activityUnit, setActivityUnit, selectedYear, earliestYear, currentUser, currentActivityType, setCurrentActivityType, formattedUserSpecificActivityForCurrentYear, isDarkMode } = this.props;
        const monthIndex = DATE.getMonth() + 1;
        const currentYear = new Date().getFullYear();

        const isCurrentYear = parseInt(selectedYear) === currentYear;
        const multiplier = isCurrentYear ? monthIndex : 12;

        return (
            <Space direction="vertical" size="large" style={{ width: '100%' }}>
                <Card style={{ border: 'none', background: 'transparent' }} bodyStyle={{ padding: 0 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px' }}>
                        <div>
                            <Title level={2} style={{ margin: 0 }}>
                                {isCurrentYear ? `Jan - ${THIS_MONTH} Triathlon` : `${selectedYear} Triathlon`}
                            </Title>
                            <Paragraph type="secondary" style={{ marginBottom: 0 }}>
                                Targets: Run {COMPETITION_DISTANCE.run * multiplier} km, 
                                Cycle {COMPETITION_DISTANCE.cycle * multiplier} km & 
                                Swim {COMPETITION_DISTANCE.swim * multiplier} km
                                <Text style={{ fontSize: '12px', display: 'block' }}>
                                    (Monthly targets: {COMPETITION_DISTANCE.run}km run, {COMPETITION_DISTANCE.cycle}km cycle, {COMPETITION_DISTANCE.swim}km swim)
                                </Text>
                            </Paragraph>
                        </div>
                        <Space>
                            <Select 
                                value={selectedYear.toString()} 
                                onChange={this.handleYearChange} 
                                style={{ width: 120 }}
                                suffixIcon={<CalendarOutlined />}
                            >
                                {Array.from({ length: currentYear - earliestYear + 1 }, (_, index) => {
                                    const year = currentYear - index;
                                    return <Option key={year} value={year.toString()}>{year}</Option>;
                                })}
                            </Select>
                            <Radio.Group value={activityUnit} onChange={(e) => setActivityUnit(e.target.value)} buttonStyle="solid">
                                <Radio.Button value="km">Km</Radio.Button>
                                <Radio.Button value="miles">Miles</Radio.Button>
                            </Radio.Group>
                        </Space>
                    </div>
                </Card>

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

                {currentUser ? (
                    <Card title={`${currentUser}'s ${selectedYear} Progress`} style={{ marginTop: '20px' }}>
                        <Space direction="vertical" size="middle" style={{ width: '100%' }}>
                            <div style={{ display: 'flex', justifyContent: 'center' }}>
                                <Radio.Group value={currentActivityType} onChange={(e) => setCurrentActivityType(e.target.value)} buttonStyle="solid">
                                    <Radio.Button value="run">Run</Radio.Button>
                                    <Radio.Button value="cycle">Cycle</Radio.Button>
                                    <Radio.Button value="swim">Swim</Radio.Button>
                                </Radio.Group>
                            </div>

                            {formattedUserSpecificActivityForCurrentYear.length > 0 ? (
                                <>
                                    <div style={{ background: isDarkMode ? '#1f1f1f' : '#fafafa', padding: '20px', borderRadius: '8px' }}>
                                        <StravaChart currentYear={true} isDarkMode={isDarkMode} />
                                    </div>
                                    <Table 
                                        columns={this.getDetailedColumns()} 
                                        dataSource={formattedUserSpecificActivityForCurrentYear} 
                                        rowKey="startDate"
                                        pagination={false}
                                        size="small"
                                    />
                                </>
                            ) : (
                                <Empty 
                                    description={
                                        <span>
                                            {isCurrentYear ? 
                                                `${currentUser} is yet to ${currentActivityType} this year` : 
                                                `${currentUser} did not ${currentActivityType} in ${selectedYear}`}
                                        </span>
                                    } 
                                />
                            )}
                        </Space>
                    </Card>
                ) : null}
            </Space>
        );
    }
}

export default YearTable;

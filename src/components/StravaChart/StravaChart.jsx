import React from "react";
import { Scatter } from "@ant-design/plots";
import dayjs from "dayjs";

const StravaChart = ({ currentActivityType, activityUnit, chartData, chartDataCurrentYear, currentYear }) => {
    const rawData = currentYear ? chartDataCurrentYear : chartData;

    if (!rawData || rawData.length <= 1) {
        return null;
    }

    const isSpeedAsTime = currentActivityType === "run" || currentActivityType === "swim";

    // Transform Google Chart data (array of arrays) to Ant Design Plots data (array of objects)
    // Header: ["ID", "Date", whatSpeed, unitRange, "Distance"]
    const data = rawData.slice(1).map((row) => {
        const dateObj = row[1];
        const speedObj = row[2];
        
        let processedSpeed = speedObj;
        if (isSpeedAsTime && speedObj instanceof Date) {
            // Convert pace to total seconds (linear value) to handle the 60-sec minute correctly
            processedSpeed = speedObj.getMinutes() * 60 + speedObj.getSeconds();
        }

        return {
            averageSpeedLabel: row[0],
            // Use timestamp for X-axis to ensure reliable date parsing
            date: dateObj instanceof Date ? dateObj.getTime() : dateObj,
            speed: processedSpeed,
            range: row[3],
            distance: row[4],
        };
    });

    const config = {
        data,
        xField: "date",
        yField: "speed",
        sizeField: "distance",
        colorField: "range",
        size: [4, 20],
        shape: "circle",
        pointStyle: {
            fillOpacity: 0.6,
            stroke: "#fff",
            lineWidth: 1,
        },
        meta: {
            date: {
                type: 'time',
                alias: 'Date',
            },
            speed: {
                // Using linear for pace ensures ticks are calculated correctly across the 60s boundary
                type: 'linear',
                alias: isSpeedAsTime ? 'Pace' : 'Speed',
            }
        },
        xAxis: {
            title: { text: "Date" },
            label: {
                formatter: (v) => dayjs(v).format("MMM YY"),
            },
        },
        yAxis: {
            title: { 
                text: currentActivityType === "cycle" ? 
                    (activityUnit === "km" ? "Speed (km/h)" : "Speed (mph)") : 
                    "Pace (min/unit)" 
            },
            label: {
                formatter: (v) => {
                    if (isSpeedAsTime) {
                        const mins = Math.floor(v / 60);
                        const secs = Math.floor(v % 60);
                        return `${mins}:${secs.toString().padStart(2, '0')}`;
                    }
                    return v;
                },
            },
        },
        tooltip: {
            showTitle: true,
            title: (v) => dayjs(v).format("DD/MM/YYYY"),
            fields: ["date", "averageSpeedLabel", "distance", "range"],
            formatter: (item) => {
                const unit = activityUnit === "km" ? "km" : "miles";
                const speedUnit = currentActivityType === "cycle" ? 
                                    (activityUnit === "km" ? "km/h" : "mph") : 
                                    "min/" + (currentActivityType === "run" ? (activityUnit === "km" ? "km" : "mile") : (activityUnit === "km" ? "100m" : "100y"));
                
                return {
                    name: "Activity",
                    value: `${item.distance}${unit} @ ${item.averageSpeedLabel} ${speedUnit}`,
                };
            },
        },
        legend: {
            position: "top",
        },
    };

    return (
        <div style={{ height: "400px" }}>
            <Scatter {...config} />
        </div>
    );
};

export default StravaChart;

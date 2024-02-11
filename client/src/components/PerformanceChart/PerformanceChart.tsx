import React from "react";
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis } from "recharts";

const data = [
    {
        name: "Array",
        score: 40,
    },
    {
        name: "Dynamic Programming",
        score: 60,
    },
    {
        name: "Hash Table",
        score: 40,
    },
    {
        name: "Greedy",
        score: 90,
    },
    {
        name:"Math",
        score: 50,
    },
    {
        name: "Sorting",
        score: 60,
    },
    {
        name:"DFS",
        score: 20,
    },
    {
        name: "BFS",
        score: 30,
    },
    {
        name: "Binary Search",
        score: 50,
    }
];

type PerformanceChartProps = {};

const PerformanceChart: React.FC<PerformanceChartProps> = () => {
    return (
        <ResponsiveContainer width="100%" height={350}>
            <BarChart data={data}>
                <XAxis
                    dataKey="name"
                    stroke="#888888"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                />
                <YAxis
                    stroke="#888888"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                    tickFormatter={(value) => `${value}`}
                />
                <Bar dataKey="score" fill="#adfa1d" radius={[10, 10, 0, 0]} />
            </BarChart>
        </ResponsiveContainer>
    );
};
export default PerformanceChart;

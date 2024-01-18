import React from "react";
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis } from "recharts";

const data = [
    {
        name: "Array",
        score: 40,
    },
    {
        name: "Two-Pointer",
        score: 50,
    },
    {
        name: "Dynamic Programming",
        score: 60,
    },
    {
        name: "Linked List",
        score: 70,
    },
    {
        name: "Stack",
        score: 80,
    },
    {
        name: "Queue",
        score: 90,
    },
    {
        name: "Hash Table",
        score: 40,
    },
    {
        name: "Binary Search",
        score: 20,
    },
    {
        name: "Tree",
        score: 10,
    },
    {
        name: "Graph",
        score: 40,
    },
    {
        name: "Greedy",
        score: 90,
    },
    {
        name: "Bit Manipulation",
        score: 40,
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

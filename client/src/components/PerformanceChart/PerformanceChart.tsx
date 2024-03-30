import { UserStruct } from "@/utils/types";
import React, { useEffect } from "react";
import { CircularProgressbar } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";

type PerformanceChartProps = {
  userData : UserStruct | null;
};
// const data = [
//   {
//     name: "Array",
//     score: 40,
//   },
//   {
//     name: "Dynamic Programming",
//     score: 60,
//   },
//   {
//     name: "Hash Table",
//     score: 40,
//   },
//   {
//     name: "Greedy",
//     score: 90,
//   },
//   {
//     name: "Math",
//     score: 50,
//   },
//   {
//     name: "Sorting",
//     score: 60,
//   },
//   {
//     name: "DFS",
//     score: 20,
//   },
//   {
//     name: "BFS",
//     score: 30,
//   },
//   {
//     name: "Binary Search",
//     score: 50,
//   },
// ];

const PerformanceChart: React.FC<PerformanceChartProps> = ({userData}) => {

  console.log("In Performance",userData);
  const [data, setData] = React.useState(userData?.scores || []);
  useEffect(() => {
    if(userData?.scores)
      setData(userData?.scores);
  }, [userData]);

  return (
    <div className="flex flex-nowrap overflow-x-auto p-4">
      {data.map((item, index) => (
        <div key={index} className="flex-shrink-0 w-1/4 mx-4">
          <div className="border rounded-lg p-4">
            <h3
              className="text-lg font-semibold mb-2 text-center"
              style={{ fontSize: "24px" }}
            >
              {item.name}
            </h3>
            <div
              style={{
                width: 200,
                height: 500,
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                margin: "0 auto",
              }}
            >
              <CircularProgressbar
                value={item.score}
                text={`${item.score}%`}
                styles={{
                  root: { width: "100%" },
                  path: { stroke: "#007bff" },
                  text: {
                    fontSize: "20px",
                    fill: "#007bff",
                    fontWeight: "bold",
                    dominantBaseline: "middle",
                    textAnchor: "middle",
                  },
                }}
              />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default PerformanceChart;

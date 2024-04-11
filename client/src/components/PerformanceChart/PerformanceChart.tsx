import { UserStruct } from "@/utils/types";
import React, { useEffect } from "react";
import { CircularProgressbar } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";

type PerformanceChartProps = {
  userData : UserStruct | null;
};

function capitalizeFirstLetter(name:string) {
  return name.charAt(0).toUpperCase() + name.slice(1);
}
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
    <div className="flex flex-col md:flex-row flex-wrap overflow-x-auto p-4">
    {data.map((item, index) => (
      <div key={index} className="flex-shrink-0 mx-4 my-2 md:my-2 w-full md:w-1/2 lg:w-1/3 xl:w-1/4">
        {item.score>0 &&
        <div className="border rounded-lg p-4">
          <h3 className="text-lg font-semibold mb-2 text-center" style={{ fontSize: "24px" }}>
            {capitalizeFirstLetter(item.name)}
          </h3>
          
            <div className="flex justify-center items-center" style={{height: "500px"}}>
            <div className="w-full sm:w-3/4 md:w-4/5 lg:w-3/4"> 
              <CircularProgressbar
                value={item.score}
                text={`${item.score}%`}
                styles={{
                  root: {}, // Adjustments for responsiveness can be made here if necessary
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
          
        </div>}
      </div>
    ))}
</div>


  );
};

export default PerformanceChart;

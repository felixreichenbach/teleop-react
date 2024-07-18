import { useState } from "react";
import LineChart from "./LineChart";
import { Data } from "../utils/sample-data";
import type { SensorClient } from "@viamrobotics/sdk";

export interface SensorReadingsProps {
  sensorClient?: SensorClient;
}

export const SensorReadings = (props: SensorReadingsProps): JSX.Element => {
  const { sensorClient } = props;
  console.log("SensorClient");
  if (sensorClient) {
    sensorClient.getReadings().then((readings) => {
      console.log(JSON.stringify(readings));
    });
  }
  // Charts Data
  const [chartData, setChartData] = useState({
    labels: Data.map((data) => data.year),
    datasets: [
      {
        label: "Users Gained ",
        data: Data.map((data) => data.userGain),
        backgroundColor: [
          "rgba(75,192,192,1)",
          "#ecf0f1",
          "#50AF95",
          "#f3ba2f",
          "#2a71d0",
        ],
        borderColor: "rgb(75, 192, 192)",
        borderWidth: 2,
        tension: 0.2,
      },
    ],
  });

  return (
    <div>
      <p>Sensor Readings</p>
      <LineChart chartData={chartData} />
    </div>
  );
};

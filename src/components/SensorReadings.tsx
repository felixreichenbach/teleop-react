import { useEffect, useRef, useState } from "react";
import { Data } from "../utils/sample-data";
import type { SensorClient } from "@viamrobotics/sdk";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  LineElement,
  Legend,
  CategoryScale,
  LinearScale,
  PointElement,
  Filler,
} from "chart.js";

ChartJS.register(
  Title,
  Tooltip,
  LineElement,
  Legend,
  CategoryScale,
  LinearScale,
  PointElement,
  Filler
);

export interface SensorReadingsProps {
  sensorClient?: SensorClient;
}

// Sensor reading structure
interface SensorReading {
  value?: number;
  timestamp?: Date;
}

export const SensorReadings = (props: SensorReadingsProps): JSX.Element => {
  const chartRef =
    useRef<ChartJS<"line", (number | undefined)[], unknown>>(null);
  const { sensorClient } = props;
  /*
  const [sensorReadings, setSensorReadings] = useState<SensorReading[]>([
    { value: 0, timestamp: new Date() },
  ]);
  
*/
  // Charts Data
  const [chartData, setChartData] = useState({
    labels: [], //sensorReadings.map((reading) => reading.timestamp),
    datasets: [
      {
        label: "Users Gained ",
        data: [], //sensorReadings.map((reading) => reading.value),
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

  useEffect(() => {
    //Implementing the setInterval method
    const interval = setInterval(() => {
      sensorClient?.getReadings().then((reading) => {
        if (reading["a"] && typeof reading["a"] === "number") {
          chartRef.current?.data.labels?.push(Date());
          chartRef.current?.data.datasets?.[0]?.data?.push(
            reading["a"] as number
          );
          chartRef.current?.update();
        }
      });
    }, 1000);
    //Clearing the interval
    return () => clearInterval(interval);
  }); //[sensorReadings]);

  return (
    <div>
      <p>Sensor Readings</p>
      <Line ref={chartRef} data={chartData} />
    </div>
  );
};

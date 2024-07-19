import { useEffect, useRef, useState } from "react";
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
type Reading = {
  label: string;
  value: number;
};

export const SensorReadings = (props: SensorReadingsProps): JSX.Element => {
  const chartRef =
    useRef<ChartJS<"line", (number | undefined)[], unknown>>(null);
  const { sensorClient } = props;

  const chartOptions = {
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  const [readings, setReadings] = useState<Reading[]>([]); // ADD EMPTY ARRAY
  const [options, setOptions] = useState(chartOptions); // REMOVED BRACKETS

  const interval = useRef<number>();

  useEffect(() => {
    interval.current = setInterval(() => {
      sensorClient?.getReadings().then((reading) => {
        if (reading["b"] && typeof reading["b"] === "number") {
          const value = reading["b"];
          setReadings((prevData) => {
            const newData = [...prevData];
            if (newData.length === 10) {
              newData.shift();
            }
            newData.push({
              label: new Date().toLocaleTimeString(),
              value: value, //Math.floor(Math.random() * 100),
            });
            return newData;
          });
        }
      });
    }, 1000);
    return () => clearInterval(interval.current);
  }, [readings]);

  // Charts Data
  const chartData = {
    labels: readings.map((reading) => reading.label),
    datasets: [
      {
        label: "Users Gained ",
        data: readings.map((reading) => reading.value),
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
  };
  return <Line ref={chartRef} data={chartData} options={options} />;
};

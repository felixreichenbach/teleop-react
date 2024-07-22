import { useEffect, useState } from "react";
import type { SensorClient } from "@viamrobotics/sdk";
import { LineChart } from "@mui/x-charts/LineChart";

export interface SensorReadingsMUIXProps {
  sensorClient?: SensorClient;
}

// Sensor reading structure
type SensorReading = {
  timestamp: Date;
  [key: string]: any;
};

// Chart series data structure
type SeriesData = {
  label: string;
  data: number[];
};

// Sensor readings component
export const SensorChart = (props: SensorReadingsMUIXProps): JSX.Element => {
  const { sensorClient } = props;
  const [readings, setReadings] = useState<SensorReading[]>([]);

  useEffect(() => {
    const intervall = setInterval(() => {
      sensorClient?.getReadings().then((reading) => {
        const sensorReading: SensorReading = { timestamp: new Date() };
        // Extract values from sensor reading
        for (const key in reading) {
          if (reading[key] && typeof reading[key] === "number") {
            sensorReading[key] = reading[key];
          }
        }
        // Update readings
        setReadings((prevData) => {
          const newData = [...prevData];
          if (newData.length === 10) {
            newData.shift();
          }
          newData.push(...[sensorReading]);
          return newData;
        });
      });
    }, 1000);
    return () => clearInterval(intervall);
  }, []);

  // Configure the series to be displayed out of the sensor readings
  const seriesConfig = [
    { label: "a", data: [] },
    { label: "b", data: [] },
  ];

  // Loop over seriesList and fill series with readings data
  const series: SeriesData[] = seriesConfig.map((config) => {
    return {
      label: config.label,
      data: readings.map((reading) => {
        return reading[config.label] || 0;
      }),
    };
  });

  return (
    <LineChart
      width={500}
      height={300}
      series={series}
      xAxis={[
        {
          scaleType: "time",
          data: readings.map((reading) => reading.timestamp),
        },
      ]}
    />
  );
};

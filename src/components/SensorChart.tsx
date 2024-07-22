import { useEffect, useState } from "react";
import type { SensorClient } from "@viamrobotics/sdk";
import { LineChart } from "@mui/x-charts/LineChart";

//Create constant of timestamps for initial chart data at one second interval for 10 data points
const initTimestamps: SensorReading[] = Array.from({ length: 10 }, (_, i) => {
  return { timestamp: new Date(Date.now() - 1000 * i) };
});
initTimestamps.reverse();

export interface SensorReadingsMUIXProps {
  sensorClient?: SensorClient;
  seriesKeys: string[]; // Sensor reading keys to display
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
  const { sensorClient, seriesKeys } = props;
  const [readings, setReadings] = useState<SensorReading[]>(initTimestamps);

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

  // Loop over seriesList and fill series with readings data
  const series: SeriesData[] = seriesKeys.map((key) => {
    return {
      label: key,
      data: readings.map((reading) => {
        return reading[key] || 0;
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

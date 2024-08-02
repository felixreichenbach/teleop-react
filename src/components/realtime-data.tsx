import { useEffect, useState } from "react";
import { SensorClient, type RobotClient } from "@viamrobotics/sdk";
import { LineChart } from "@mui/x-charts/LineChart";

// Sensor readings component properties
export interface SensorChartProps {
  machineClient: RobotClient;
  config: Config;
}

// Data collection configuration
type Config = {
  pollInterval: number; // Poll interval in hz (1hz = 1/s)
  timespan: number; // Time span to display in seconds
  sensorName: string; // Sensor name
  readingKeys: string[]; // Sensor reading keys to display
};

// Sensor reading structure
type SensorReading = {
  timestamp: Date;
  [key: string]: any;
};

// Sensor readings component
export const SensorChart = (props: SensorChartProps): JSX.Element => {
  const { machineClient, config } = props;
  const [readings, setReadings] = useState<SensorReading[]>([]);
  // Uses default series configuration for each provided key in seriesKeys prop
  const series = config.readingKeys.map((key) => {
    return { dataKey: key, showMark: false };
  });

  const intervalMS = 1000 / config.pollInterval;
  const timespanMS = config.timespan * 1000;
  const bufferSize = config.timespan / (1 / config.pollInterval);

  // Poll sensor readings every second
  useEffect(() => {
    const sensorClient = new SensorClient(machineClient, config.sensorName);
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
          if (newData.length >= bufferSize) {
            newData.shift();
          }
          newData.push(...[sensorReading]);
          return newData;
        });
      });
    }, intervalMS);

    return () => clearInterval(intervall);
  }, []);

  return (
    <LineChart
      width={500}
      height={300}
      series={series}
      dataset={readings}
      xAxis={[
        {
          scaleType: "time",
          dataKey: "timestamp",
          min: new Date(Date.now() - timespanMS),
          max: new Date(),
        },
      ]}
      yAxis={[{ min: 0 }]}
    />
  );
};

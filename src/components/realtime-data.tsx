import { useEffect, useState } from "react";
import { SensorClient, type RobotClient } from "@viamrobotics/sdk";
import { LineChart } from "@mui/x-charts/LineChart";

// Sensor readings component properties
export interface SensorReadingsMUIXProps {
  machineClient: RobotClient;
  sensorName: string;
  seriesKeys: string[]; // Sensor reading keys to display
}

// Sensor reading structure
type SensorReading = {
  timestamp: Date;
  [key: string]: any;
};

// Sensor readings component
export const SensorChart = (props: SensorReadingsMUIXProps): JSX.Element => {
  const { machineClient, sensorName, seriesKeys } = props;
  // TODO: Replace "fake-sensor" with the sensor name you want to use
  const sensorClient = new SensorClient(machineClient, sensorName);
  // Initialize readings with timestamps and null values for each provided seriesKey in props
  const [readings, setReadings] = useState<SensorReading[]>([]);

  // Uses default series configuration for each provided key in seriesKeys prop
  const series = seriesKeys.map((key) => {
    return { dataKey: key, showMark: false };
  });

  // Poll sensor readings every second
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
          // Keep only 10 data points
          if (newData.length >= 10) {
            newData.shift();
          }
          newData.push(...[sensorReading]);
          return newData;
        });
      });
    }, 1000); // Poll every second
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
          min: new Date(Date.now() - 10000), // Display the last 10 seconds
        },
      ]}
      yAxis={[{ min: 0 }]}
    />
  );
};

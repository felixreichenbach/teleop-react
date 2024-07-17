import { Bar } from "react-chartjs-2";
//import { Chart as ChartJS } from "chart.js";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);
//ChartJS.register();

export default function BarChart({ chartData }: any) {
  return (
    <Bar
      data={chartData}
      options={{
        plugins: {
          title: {
            display: true,
            text: "Users Gained between 2016-2020",
          },
          legend: {
            display: false,
          },
        },
      }}
    />
  );
}

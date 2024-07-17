import { VideoStream } from "./components/video-stream.js";
import { ConnectForm } from "./components/connect-form.js";
import { MotionArrows } from "./components/motion-arrows.js";
import { useStore, useStream } from "./state.js";
import { useMotionControls } from "./motion.js";

import { useState } from "react";
import { Data } from "./utils/sample-data.js";
import PieChart from "./components/PieChart";
import LineChart from "./components/LineChart.js";
import BarChart from "./components/BarChart.js";

export const App = (): JSX.Element => {
  const { status, connectOrDisconnect, streamClient, baseClient } = useStore();
  const stream = useStream(streamClient, "cam");
  const [motionState, requestMotion] = useMotionControls(baseClient);

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
    <>
      <ConnectForm status={status} onSubmit={connectOrDisconnect} />
      <VideoStream stream={stream}>
        {baseClient ? (
          <MotionArrows
            motionState={motionState}
            requestMotion={requestMotion}
          />
        ) : null}
      </VideoStream>
      <PieChart chartData={chartData} />
      <LineChart chartData={chartData} />
      <BarChart chartData={chartData} />
    </>
  );
};

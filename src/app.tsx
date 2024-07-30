import { ConnectForm } from "./components/connect-form.js";
import { useStore, useStream } from "./state.js";

import { ViamCloud } from "./components/historic-data.js";

import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { SensorChart } from "./components/realtime-chart.js";
import { VideoStream } from "./components/video-stream.js";

export const App = (): JSX.Element => {
  const {
    machineStatus,
    machineClient,
    sensorClient,
    viamClient,
    streamClient,
    connectOrDisconnect,
  } = useStore();
  // Change the camera name to the camera / transform you want to use
  const stream = useStream(streamClient, "transform");

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <div className="flex flex-col max-w-7xl mx-auto">
        <div>
          <h1 className="text-3xl font-bold">Viam - Human Machine Interface</h1>
        </div>
        <div className="bg-neutral-100 border-2 rounded-xl">
          <ConnectForm status={machineStatus} onSubmit={connectOrDisconnect} />
        </div>
        <div>
          {machineClient ? (
            <div className="flex flex-col border-2 rounded-xl">
              <div className="flex flex-row">
                <div className="basis-1/2">
                  <SensorChart
                    sensorClient={sensorClient}
                    seriesKeys={["a", "b", "c"]} // Configure the sensor reading keys you want to display on the chart
                  ></SensorChart>
                </div>
                <div className="basis-1/2">
                  <ViamCloud viamClient={viamClient} />
                </div>
              </div>
              <div className="flex flex-row">
                <div className="basis-1/2">
                  <VideoStream stream={stream}></VideoStream>
                </div>
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </LocalizationProvider>
  );
};

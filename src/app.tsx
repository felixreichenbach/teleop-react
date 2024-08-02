import { ConnectForm } from "./components/connect-form.js";
import { useStore } from "./state.js";

import { ViamCloud } from "./components/historic-data.js";

import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { SensorChart } from "./components/realtime-data.js";
import { DoCommand } from "./components/do-command.js";
import { VideoStream } from "./components/video-stream.js";

export const App = (): JSX.Element => {
  const { machineStatus, machineClient, viamClient, connectOrDisconnect } =
    useStore();

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <div className="flex flex-col max-w-7xl mx-auto ">
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
                  <VideoStream
                    machineClient={machineClient}
                    cameraName="camera" // TODO: Specify the camera name you want to use
                  />
                </div>
                <div className="basis-1/2 content-center">
                  <DoCommand machineClient={machineClient}></DoCommand>
                </div>
              </div>
              <div className="flex flex-row">
                <div className="basis-1/2">
                  <SensorChart
                    machineClient={machineClient}
                    config={{
                      pollInterval: 1, // TODO: Specify the poll interval in hz (1hz = 1/s)
                      timespan: 10, // TODO: Specify time span to display in seconds
                      sensorName: "fake-sensor", // TODO: Specify the sensor name you want to use
                      readingKeys: ["a", "b", "c"], // TODO: Specify the sensor reading keys you want to display on the chart
                    }}
                  ></SensorChart>
                </div>
                <div className="basis-1/2">
                  <ViamCloud viamClient={viamClient} />
                </div>
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </LocalizationProvider>
  );
};

import { LoginForm } from "./components/login-form.js";
import { useStore } from "./state.js";

import { TabularByFilter } from "./components/tabular-filter.js";

import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { RealTimeSensor } from "./components/realtime-sensor.js";
import { DoCommand } from "./components/do-command.js";
import { VideoStream } from "./components/video-stream.js";
import { TabularByMQL } from "./components/tabular-mql.js";

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
          <LoginForm status={machineStatus} onSubmit={connectOrDisconnect} />
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
                  <RealTimeSensor
                    machineClient={machineClient}
                    config={{
                      pollInterval: 1, // TODO: Specify the poll interval in hz (1hz = 1/s)
                      timespan: 10, // TODO: Specify time span to display in seconds
                      sensorName: "fake-sensor", // TODO: Specify the sensor name you want to use
                      readingKeys: ["a", "b", "c"], // TODO: Specify the sensor reading keys you want to display on the chart
                    }}
                  ></RealTimeSensor>
                </div>
                <div className="basis-1/2">
                  <TabularByFilter viamClient={viamClient} />
                </div>
              </div>
              <div className="flex flex-row">
                <TabularByMQL
                  viamClient={viamClient}
                  organizationID="96b696a0-51b9-403b-ae0d-63753923652f"
                />
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </LocalizationProvider>
  );
};

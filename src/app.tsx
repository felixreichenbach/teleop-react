import { ConnectForm } from "./components/connect-form.js";
import { useStore } from "./state.js";

import { SensorReadings } from "./components/SensorReadings.js";
import { ViamCloud } from "./components/ViamCloud.js";

import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";

export const App = (): JSX.Element => {

  const {
    machineStatus,
    machineClient,
    sensorClient,
    viamClient,
    connectOrDisconnect,
  } = useStore();

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <div className="flex flex-col max-w-7xl mx-auto">
        <div>
          <h1 className="text-3xl font-bold">Viam Machine Monitor</h1>
        </div>
        <div className="bg-neutral-100 border-2 rounded-xl">
          <ConnectForm status={machineStatus} onSubmit={connectOrDisconnect} />
        </div>
        <div>
          {machineClient ? (
            <div className="flex flex-row border-2">
              <div className="basis-1/2 border-2">
                <SensorReadings sensorClient={sensorClient} />
              </div>
              <div className="basis-1/2 border-2">
                <ViamCloud viamClient={viamClient} />
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </LocalizationProvider>
  );
};

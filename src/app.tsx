import { ConnectForm } from "./components/connect-form.js";
import { useStore } from "./state.js";

import { SensorReadings } from "./components/SensorReadings.js";

export const App = (): JSX.Element => {
  const { machineStatus, sensorClient, machineClient, connectOrDisconnect } =
    useStore();

  return (
    <div className="flex flex-col max-w-7xl mx-auto">
      <div>
        <h1 className="text-3xl font-bold">Viam Machine Monitor</h1>
      </div>
      <div className="bg-neutral-100 border-2 rounded-xl">
        <ConnectForm status={machineStatus} onSubmit={connectOrDisconnect} />
      </div>
      <div>
        <div className="flex flex-row">
          <div className="basis-1/2">
            {machineClient ? (
              <SensorReadings sensorClient={sensorClient} />
            ) : null}
          </div>
          <div className="basis-1/2"></div>
        </div>
      </div>
    </div>
  );
};

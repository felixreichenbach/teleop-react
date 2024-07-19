import { ConnectForm } from "./components/connect-form.js";
import { useStore } from "./state.js";

import { SensorReadings } from "./components/SensorReadings.js";

export const App = (): JSX.Element => {
  const { status, connectOrDisconnect, client, sensorClient } = useStore();

  return (
    <div className="flex flex-col">
      <div>
        <h1 className="text-3xl font-bold">Viam Machine Monitor</h1>
      </div>
      <div className="bg-neutral-100 border-2 rounded-xl">
        <ConnectForm status={status} onSubmit={connectOrDisconnect} />
      </div>
      <div>
        <div className="flex flex-row">
          <div className="w-1/2">
            {client ? <SensorReadings sensorClient={sensorClient} /> : null}
          </div>
        </div>
      </div>
    </div>
  );
};

import { VideoStream } from "./components/video-stream.js";
import { ConnectForm } from "./components/connect-form.js";
import { MotionArrows } from "./components/motion-arrows.js";
import { useStore, useStream } from "./state.js";
import { useMotionControls } from "./motion.js";

import { SensorReadings } from "./components/SensorReadings.js";

export const App = (): JSX.Element => {
  const {
    status,
    connectOrDisconnect,
    streamClient,
    baseClient,
    client,
    sensorClient,
  } = useStore();
  const stream = useStream(streamClient, "cam");
  const [motionState, requestMotion] = useMotionControls(baseClient);

  return (
    <div className="max-w-7xl mx-auto grid ">
      <h1 className="text-3xl font-bold">Viam TeleOp</h1>
      <div className="bg-neutral-100 border-2 rounded-xl">
        <ConnectForm status={status} onSubmit={connectOrDisconnect} />
      </div>
      {streamClient ? (
        <div className="bg-neutral-100 border-2 rounded-xl">
          <VideoStream stream={stream}>
            {baseClient ? (
              <MotionArrows
                motionState={motionState}
                requestMotion={requestMotion}
              />
            ) : null}
          </VideoStream>
        </div>
      ) : null}
      <div className="justify-center">
        {client ? (
          <>
            <SensorReadings sensorClient={sensorClient} />
          </>
        ) : null}
      </div>
    </div>
  );
};

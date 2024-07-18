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
    <>
      <ConnectForm status={status} onSubmit={connectOrDisconnect} />
      {streamClient ? (
        <VideoStream stream={stream}>
          {baseClient ? (
            <MotionArrows
              motionState={motionState}
              requestMotion={requestMotion}
            />
          ) : null}
        </VideoStream>
      ) : null}
      <>
        {client ? (
          <>
            <SensorReadings sensorClient={sensorClient} />
          </>
        ) : null}
      </>
    </>
  );
};

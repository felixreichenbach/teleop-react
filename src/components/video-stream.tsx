import { StreamClient, type RobotClient } from "@viamrobotics/sdk";
import { useRef, useEffect, type ReactNode, useState } from "react";

export interface VideoStreamProps {
  cameraName: string;
  machineClient: RobotClient;
  children?: ReactNode;
}

export const VideoStream = (props: VideoStreamProps): JSX.Element => {
  const { machineClient, cameraName, children } = props;
  const videoRef = useRef<HTMLVideoElement>(null);
  const okToConnectRef = useRef(true);
  const [stream, setStream] = useState<MediaStream | undefined>(undefined);

  if (videoRef.current && stream?.active) {
    videoRef.current.srcObject = stream;
  }

  useEffect(() => {
    const streamClient = new StreamClient(machineClient);
    if (streamClient && okToConnectRef.current) {
      okToConnectRef.current = false;
      streamClient
        .getStream(cameraName)
        .then((stream) => {
          if (videoRef.current) {
            setStream(stream);
          }
        })
        .catch((error) => {
          console.warn(`Unable to connect to camera ${cameraName}`, error);
        });
    }
    return () => {
      if (stream && stream?.active) {
        streamClient.remove(cameraName).catch((error: unknown) => {
          console.warn(`Unable to disconnect to camera ${cameraName}`, error);
          okToConnectRef.current = true;
        });
      }
    };
  }, []);

  return (
    <div className="relative inline-flex p-4">
      <video ref={videoRef} autoPlay muted />
      {children}
    </div>
  );
};

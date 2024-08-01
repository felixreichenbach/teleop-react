import type { StreamClient } from "@viamrobotics/sdk";
import { useRef, useEffect, type ReactNode, useState } from "react";

export interface VideoStreamProps {
  streamClient: StreamClient;
  cameraName: string;
  children?: ReactNode;
}

export const VideoStream = (props: VideoStreamProps): JSX.Element => {
  const { streamClient, cameraName, children } = props;
  const videoRef = useRef<HTMLVideoElement>(null);
  const okToConnectRef = useRef(true);
  const [stream, setStream] = useState<MediaStream | undefined>(undefined);

  if (videoRef.current && stream?.active) {
    videoRef.current.srcObject = stream;
  }

  useEffect(() => {
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
        streamClient.remove("camera").catch((error: unknown) => {
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

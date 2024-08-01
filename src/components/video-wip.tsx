import type { StreamClient } from "@viamrobotics/sdk";
import { useRef, useEffect, type ReactNode, useState } from "react";

export interface VideoStreamProps {
  streamClient: StreamClient;
  children?: ReactNode;
}

export const VideoSimple = (props: VideoStreamProps): JSX.Element => {
  const { streamClient, children } = props;
  const videoRef = useRef<HTMLVideoElement>(null);
  const okToConnectRef = useRef(true);
  const [stream, setStream] = useState<MediaStream | undefined>(undefined);

  if (videoRef.current && stream?.active) {
    console.log("update stream");
    videoRef.current.srcObject = stream;
  }

  useEffect(() => {
    console.log("VideoSimple useEffect", okToConnectRef.current);
    if (streamClient && okToConnectRef.current) {
      okToConnectRef.current = false;
      streamClient
        .getStream("camera")
        .then((stream) => {
          if (videoRef.current) {
            setStream(stream);
          }
        })
        .catch((error) => {
          console.warn(`Unable to connect to camera ${"camera"}`, error);
        });
    }
    return () => {
      if (stream && stream?.active) {
        streamClient.remove("camera").catch((error: unknown) => {
          console.warn(`Unable to disconnect to camera ${"camera"}`, error);
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

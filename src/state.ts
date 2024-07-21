import { useEffect, useRef, useState } from "react";
import type {
  ViamClient,
  RobotClient,
  StreamClient,
  BaseClient,
  SensorClient,
} from "@viamrobotics/sdk";
import {
  getRobotClient,
  getViamClinet,
  //getBaseClient,
  //getStreamClient,
  //getStream,
  getSensorClient,
  type RobotCredentials,
} from "./client.js";

export const DISCONNECTED = "disconnected";
export const CONNECTING = "connecting";
export const DISCONNECTING = "disconnecting";
export const CONNECTED = "connected";

interface MachineClientStateDisconnected {
  status: typeof DISCONNECTED;
  error?: unknown;
}

interface ViamClientStateDisconnected {
  status: typeof DISCONNECTED;
  error?: unknown;
}

interface MachineClientStateTransitioning {
  status: typeof CONNECTING | typeof DISCONNECTING;
}

interface ViamClientStateTransitioning {
  status: typeof CONNECTING | typeof DISCONNECTING;
}

interface MachineClientStateConnected {
  status: typeof CONNECTED;
  client: RobotClient;
  baseClient: BaseClient | undefined;
  streamClient: StreamClient | undefined;
  sensorClient: SensorClient | undefined;
}

interface ViamClientStateConnected {
  status: typeof CONNECTED;
  client: ViamClient;
}

type MachineClientState =
  | MachineClientStateDisconnected
  | MachineClientStateTransitioning
  | MachineClientStateConnected;

type ViamClientState =
  | ViamClientStateDisconnected
  | ViamClientStateTransitioning
  | ViamClientStateConnected;

export type MachineClientStatus = MachineClientState["status"];
export type ViamClientStatus = ViamClientState["status"];

export interface Store {
  machineStatus: MachineClientStatus;
  machineClient?: RobotClient;
  viamStatus: MachineClientStatus;
  viamClient?: ViamClient;
  streamClient?: StreamClient;
  baseClient?: BaseClient;
  sensorClient?: SensorClient;
  connectOrDisconnect: (credentials: RobotCredentials) => unknown;
}

export const useStore = (): Store => {
  const [machineState, setMachineState] = useState<MachineClientState>({
    status: DISCONNECTED,
  });
  const [viamState, setViamState] = useState<ViamClientState>({
    status: DISCONNECTED,
  });

  if (machineState.status === DISCONNECTED && machineState.error) {
    console.warn("Connection error", machineState.error);
  }

  const connectOrDisconnect = (credentials: RobotCredentials): void => {
    console.log("Connecting to machine");
    if (machineState.status === DISCONNECTED) {
      console.log("Connecting to machine");
      setMachineState({ status: CONNECTING });
      getRobotClient(credentials)
        .then((client) => {
          //const streamClient = getStreamClient(client);
          //const baseClient = getBaseClient(client);
          const sensorClient = getSensorClient(client);
          console.log("Connected to machine", sensorClient);
          setMachineState({
            status: CONNECTED,
            client,
            streamClient: undefined,
            baseClient: undefined,
            sensorClient,
          });
        })
        .catch((error: unknown) =>
          setMachineState({ status: DISCONNECTED, error })
        );
    } else if (
      machineState.status === CONNECTED &&
      viamState.status === CONNECTED
    ) {
      if (machineState.status === CONNECTED) {
        setMachineState({ status: DISCONNECTING });
        machineState.client
          .disconnect()
          .then(() => setMachineState({ status: DISCONNECTED }))
          .catch((error: unknown) =>
            setMachineState({ status: DISCONNECTED, error })
          );
      }
      // TODO: Disconnect from Viam
    }

    // TODO: Get a ViamClient
    if (viamState.status === DISCONNECTED) {
      console.log("Connecting to Viam");
      getViamClinet(credentials)
        .then((client) => {
          setViamState({ status: CONNECTED, client });
        })
        .catch((error: unknown) =>
          setViamState({ status: DISCONNECTED, error })
        );
    }
  };

  return {
    viamStatus: viamState.status,
    viamClient: viamState.status === CONNECTED ? viamState.client : undefined,
    machineStatus: machineState.status,
    machineClient:
      machineState.status === CONNECTED ? machineState.client : undefined,
    sensorClient:
      machineState.status === CONNECTED ? machineState.sensorClient : undefined,
    connectOrDisconnect: connectOrDisconnect,
  };
};

export const useStream = (
  streamClient: StreamClient | undefined,
  cameraName: string
): MediaStream | undefined => {
  const okToConnectRef = useRef(true);
  const [stream, setStream] = useState<MediaStream | undefined>();

  useEffect(() => {
    if (streamClient && okToConnectRef.current) {
      okToConnectRef.current = false;

      streamClient
        .getStream(cameraName)
        .then((mediaStream) => setStream(mediaStream))
        .catch((error: unknown) => {
          console.warn(`Unable to connect to camera ${cameraName}`, error);
        });

      return () => {
        okToConnectRef.current = true;

        streamClient.remove(cameraName).catch((error: unknown) => {
          console.warn(`Unable to disconnect to camera ${cameraName}`, error);
        });
      };
    }

    return undefined;
  }, [streamClient, cameraName]);

  return stream;
};

import { useState } from "react";
import type { ViamClient, RobotClient } from "@viamrobotics/sdk";
import {
  getRobotClient,
  getViamClient,
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
    if (machineState.status === DISCONNECTED) {
      console.log("Connecting to machine");
      setMachineState({ status: CONNECTING });
      getRobotClient(credentials)
        .then((client) => {
          setMachineState({
            status: CONNECTED,
            client,
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

    // Get a ViamClient
    if (viamState.status === DISCONNECTED) {
      console.log("Connecting to Viam");
      getViamClient(credentials)
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
    connectOrDisconnect: connectOrDisconnect,
  };
};

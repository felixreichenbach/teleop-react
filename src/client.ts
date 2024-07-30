import {
  createRobotClient,
  StreamClient,
  BaseClient,
  SensorClient,
  type RobotClient,
  createViamClient,
  type ViamClient,
} from "@viamrobotics/sdk";

export interface RobotCredentials {
  hostname: string;
  keyID: string;
  key: string;
}

/**
 * Given a set of credentials, get a robot client.
 *
 * @param credentials Robot URL and location secret
 * @returns A connected client
 */
export const getRobotClient = async (
  credentials: RobotCredentials
): Promise<RobotClient> => {
  const { hostname, keyID, key } = credentials;

  return createRobotClient({
    host: hostname,
    credential: {
      type: "api-key",
      /* Replace "<API-KEY>" (including brackets) with your machine's api key */ payload:
        key,
    },
    /* Replace "<API-KEY-ID>" (including brackets) with your machine's api key id */ authEntity:
      keyID,
    signalingAddress: "https://app.viam.com:443",
  });
};

// TODO: Add a function to get a ViamClient
export const getViamClient = async (
  credentials: RobotCredentials
): Promise<ViamClient> => {
  const { keyID, key } = credentials;
  return createViamClient({
    credential: {
      type: "api-key",
      authEntity: keyID,
      payload: key,
    },
  });
};

/**
 * StreamClient factory
 *
 * @param client A connected RobotClient
 * @returns A connected stream client
 */
export const getStreamClient = (client: RobotClient): StreamClient => {
  return new StreamClient(client);
};

/**
 * BaseClient factory
 *
 * @param client A connected RobotClient
 * @returns A connected base client
 */
export const getBaseClient = (client: RobotClient): BaseClient => {
  // TODO: Replace "viam_base" with the name of the base you want to use
  return new BaseClient(client, "viam_base");
};

/**
 * SensorClient factory
 *
 * @param client A connected RobotClient
 * @returns A connected sensor client
 */
export const getSensorClient = (client: RobotClient): SensorClient => {
  // TODO: Replace "fake-sensor" with the name of the sensor you want to use
  return new SensorClient(client, "fake-sensor");
};

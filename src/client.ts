import {
  createRobotClient,
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

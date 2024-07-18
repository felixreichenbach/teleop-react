import {
  createRobotClient,
  StreamClient,
  BaseClient,
  type RobotClient,
} from '@viamrobotics/sdk';

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
    host:hostname,
    credential: {
      type: 'api-key' 
      /* Replace "<API-KEY>" (including brackets) with your machine's api key */,
      payload: key,
    } 
      /* Replace "<API-KEY-ID>" (including brackets) with your machine's api key id */,
    authEntity: keyID,
    signalingAddress: 'https://app.viam.com:443',
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
  return new BaseClient(client, 'viam_base');
};

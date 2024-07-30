# React Viam-HMI Example

This example project allows you to connect to a running Viam RDK and display real time sensor data directly from a machine as well as access historic data stored in the Viam cloud platform through a single authenticated client application.

## Setup

First, follow the setup instructions for the repository in `CONTRIBUTING.md`. Then, install development dependencies for the demo and launch a dev server.

```shell
npm install
```

The connection hostname and secret fields can be pre-filled from a `.env` file in the `viam-hmi` directory. You have to set these before running npm start.

```ini
# teleop-react/.env
VITE_ROBOT_HOSTNAME=my-cool-robot.viam.cloud
VITE_ROBOT_KEY_ID=key-id
VITE_ROBOT_KEY=super-secret-key
```

```shell
npm start
```

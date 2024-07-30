# React Viam-HMI Example

This example project allows you to connect to a running Viam RDK and display real time sensor data directly from a machine as well as access historic data stored in the Viam cloud platform through a single authenticated client application.

## Setup

Install development dependencies for the application:

```shell
npm install
```

The connection hostname and secret fields can be pre-filled from a `.env` file in the `viam-hmi` directory. This step is optional, you can enter the information into the login form manually later as well.

```ini
# teleop-react/.env
VITE_ROBOT_HOSTNAME=my-cool-robot.viam.cloud
VITE_ROBOT_KEY_ID=key-id
VITE_ROBOT_KEY=super-secret-key
```
Launch the development server

```shell
npm start
```

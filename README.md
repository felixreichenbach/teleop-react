# React Tele-operation Example

This example project allows you to stream a video from a Viam Rover and control its movements with your keyboard or mouse.

## Setup

First, follow the setup instructions for the repository in `CONTRIBUTING.md`. Then, install development dependencies for the demo and launch a dev server.

```shell
cd teleop-react
npm install
```

The connection hostname and secret fields can be pre-filled from a `.env` file in the `teleop-react` directory. You have to set these before running npm start.

```ini
# teleop-react/.env
VITE_ROBOT_HOSTNAME=my-cool-robot.viam.cloud
VITE_ROBOT_KEY_ID=key-id
VITE_ROBOT_KEY=super-secret-key
```

```shell
npm start
```

### Base Project Template

This example assumes that you are working inside the Viam TypeScript SDK repository. If you want to use this example as a base for your project, make the following changes:

- You will also need to rename the components in the example code to match the actual component names in your configuration, for example, the camera could be named "cam" here but "camera" in your configuration.

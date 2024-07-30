import { RobotClient, SensorClient } from "@viamrobotics/sdk";
import {
  useState,
  type ChangeEventHandler,
  type FormEventHandler,
} from "react";

export interface DoCommandProps {
  machineClient?: RobotClient;
}

export function DoCommand(props: DoCommandProps): JSX.Element {
  // Get the component for which you want to run the command
  const componenClient = new SensorClient(props.machineClient!, "fake-sensor");
  const [command, setCommmand] = useState("");

  const onSubmit: FormEventHandler = (event) => {
    console.log("DoCommand: ", command);
    componenClient
      .doCommand({ command })
      .then((response) => {
        console.log("DoCommand response: ", response);
      })
      .catch((error) => {
        console.error("DoCommand error: ", error);
      });
    event.preventDefault();
  };

  const handleCommand: ChangeEventHandler<HTMLTextAreaElement> = (event) => {
    setCommmand(event.target.value);
  };

  return (
    <form onSubmit={onSubmit}>
      <div className="flex flex-col mb-1 p-4">
        <label className="flex flex-col mb-1">
          Input Commmand:
          <textarea
            className="px-1 border-solid border-2 border-black"
            value={command}
            onChange={handleCommand}
            disabled={false}
          />
        </label>
        <button
          type="submit"
          className="rounded self-end border-gray-500 border-2 px-1"
        >
          Run Command
        </button>
      </div>
    </form>
  );
}

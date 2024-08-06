import { RobotClient, SensorClient, type StructType } from "@viamrobotics/sdk";
import type { ResourceName } from "@viamrobotics/sdk/dist/gen/common/v1/common_pb";
import {
  useEffect,
  useState,
  type ChangeEventHandler,
  type FormEventHandler,
} from "react";

export interface DoCommandProps {
  machineClient?: RobotClient;
}

export function DoCommand(props: DoCommandProps): JSX.Element {
  const { machineClient } = props;
  const [command, setCommmand] = useState("");
  const [result, setResult] = useState("");
  const [resources, setResources] = useState<ResourceName.AsObject[]>();
  const [selectedResource, setSelectedResource] = useState("");

  useEffect(() => {
    if (!machineClient) {
      return;
    }
    machineClient
      .resourceNames()
      .then((res) => {
        const filteredComponents = res.filter((resource) => {
          return resource.subtype === "sensor";
        });
        setResources(filteredComponents);
        setSelectedResource(filteredComponents[0]?.name ?? "");
      })
      .catch((error) => {
        console.error("Failed to fetch resources: ", error.message);
      });
  }, []);

  const onSubmit: FormEventHandler = (event) => {
    if (!machineClient) {
      return;
    }
    const componenClient = new SensorClient(machineClient, selectedResource);
    let parsed = JSON.parse(command);
    componenClient
      .doCommand(parsed as StructType)
      .then((response) => {
        setResult(JSON.stringify(response));
      })
      .catch((error) => {
        setResult("error: " + error.message);
      });
    event.preventDefault();
  };

  const handleCommand: ChangeEventHandler<HTMLTextAreaElement> = (event) => {
    setCommmand(event.target.value);
  };

  const handleResourceChange: ChangeEventHandler<HTMLSelectElement> = (
    event
  ) => {
    setSelectedResource(event.target.value);
  };

  return (
    <>
      {" "}
      <div className="flex flex-col mb-1 p-4">
        <form onSubmit={onSubmit}>
          <label className="flex flex-col mb-1">
            Select Resource:
            <select
              className="px-1 border-solid border-2 border-black"
              value={selectedResource}
              onChange={handleResourceChange}
            >
              {resources?.map((resource) => (
                <option key={resource.name} value={resource.name}>
                  {resource.name}
                </option>
              ))}
            </select>
          </label>
          <label className="flex flex-col mb-1">
            Commmand Input:
            <textarea
              className="px-1 border-solid border-2 border-black"
              value={command}
              onChange={handleCommand}
              disabled={false}
            />
          </label>
          <button
            type="submit"
            className="rounded self-end border-gray-500 border-2 px-1 float-right"
          >
            Run Command
          </button>
        </form>
        <label className="flex flex-col mb-1">
          Command Response:
          <textarea
            className="px-1 border-solid border-2 border-black"
            value={result}
            disabled={true}
          />
        </label>
      </div>
    </>
  );
}

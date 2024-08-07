import type { ViamClient } from "@viamrobotics/sdk";
import { BSON } from "bsonfy";
import {
  useState,
  type ChangeEventHandler,
  type FormEventHandler,
} from "react";

export interface TabularByMQLProps {
  viamClient?: ViamClient;
  organizationID?: string;
}

// TODO: Implement a component that queries data from DataMQL using MQL: https://github.com/viam-soleng/viam-grafana-mql/blob/main/src/viamData.ts

export function TabularByMQL(props: TabularByMQLProps): JSX.Element {
  const { viamClient, organizationID } = props;

  const [query, setQuery] = useState<string>('[{ "$limit": 1 }]');
  const [result, setResult] = useState("");

  const handleQuery: ChangeEventHandler<HTMLTextAreaElement> = (event) => {
    setQuery(event.target.value);
  };

  const onSubmit: FormEventHandler = (event) => {
    event.preventDefault();
    setResult("Executing query...");
    if (!viamClient?.dataClient) {
      return;
    }
    // Check if the query is valid JSON
    let jsonQuery;
    try {
      jsonQuery = JSON.parse(query);
    } catch (error) {
      console.error("Invalid JSON");
      return;
    }
    var bsonQuery: Uint8Array[];
    // Check if the query is an array
    if (!Array.isArray(jsonQuery)) {
      // Convert the parsed JSON to BSON
      console.log("single query");
      bsonQuery = [BSON.serialize(jsonQuery)];
    } else {
      bsonQuery = jsonQuery.map((stage) => BSON.serialize(stage));
    }
    viamClient.dataClient
      .tabularDataByMQL(organizationID ?? "", bsonQuery)
      .then((response) => {
        console.log(response);
        setResult(JSON.stringify(response));
      })
      .catch((error) => {
        setResult("error: " + error.message);
      });
  };

  return (
    <div className="flex flex-auto">
      <form onSubmit={onSubmit} className="basis-1/2 p-4">
        <label className="flex flex-col mb-1">
          MQL Query:
          <textarea
            className="px-1 border-solid border-2 border-black basis-auto"
            name="query"
            value={query}
            onChange={handleQuery}
            disabled={false}
          />
        </label>
        <button
          className="rounded self-end border-gray-500 border-2 px-1 float-right"
          type="submit"
        >
          Execute Query
        </button>
      </form>
      <div className="basis-1/2 p-4">
        <label className="flex flex-col mb-1">
          Query Result:
          <textarea
            className="px-1 border-solid border-2 border-black"
            value={result}
            disabled={true}
          />
        </label>
      </div>
    </div>
  );
}

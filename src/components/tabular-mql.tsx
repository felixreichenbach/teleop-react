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

export function TabuleByMQL(props: TabularByMQLProps): JSX.Element {
  const { viamClient, organizationID } = props;

  const [query, setQuery] = useState<string>("");
  const [result, setResult] = useState("");

  const handleQuery: ChangeEventHandler<HTMLTextAreaElement> = (event) => {
    setQuery(event.target.value);
  };

  const handleResult: ChangeEventHandler<HTMLTextAreaElement> = (event) => {
    setResult(event.target.value);
  };

  const onSubmit: FormEventHandler = (event) => {
    event.preventDefault();
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
    <>
      <form onSubmit={onSubmit}>
        <label className="flex flex-col mb-1">
          Query:
          <textarea
            className="px-1 border-solid border-2 border-black"
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
          Run Query
        </button>
      </form>
      <label className="flex flex-col mb-1">
        Result:
        <textarea
          className="px-1 border-solid border-2 border-black"
          value={result}
          disabled={true}
        />
      </label>
    </>
  );
}

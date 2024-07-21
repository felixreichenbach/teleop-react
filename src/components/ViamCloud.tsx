import type { ViamClient, FilterOptions } from "@viamrobotics/sdk";
import { useEffect, useState } from "react";

export interface ViamCloudProps {
  viamClient?: ViamClient;
}

// Sensor reading structure
type Reading = {
  label: string;
  value: any;
};

export function ViamCloud(props: ViamCloudProps): JSX.Element {
  const dataClient = props.viamClient?.dataClient;

  const [data, setData] = useState<Reading[]>([]);

  // Create FilterOptions
  const date = new Date();
  const options: FilterOptions = {
    endTime: date,
    startTime: new Date(date.valueOf() - 1000 * 60 * 5),
  };
  // Create Filter
  const filter = dataClient?.createFilter(options);
  // Query data
  useEffect(() => {
    dataClient?.tabularDataByFilter(filter, 5).then((data) => {
      setData([{ label: "felix", value: data.data }]);
      console.log(JSON.stringify(data));
      return data;
    });
  }, [data]);

  return (
    <div className="">
      <p className="text-2xl font-bold text-center">{JSON.stringify(data)}</p>
    </div>
  );
}

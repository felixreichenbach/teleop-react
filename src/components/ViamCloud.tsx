import type { ViamClient, FilterOptions } from "@viamrobotics/sdk";
import { useState, type FormEventHandler } from "react";
import { DateTimePicker } from "@mui/x-date-pickers";
import { Dayjs } from "dayjs";

export interface ViamCloudProps {
  viamClient?: ViamClient;
}

// Date range
type DateRange = {
  startTime: Dayjs | null;
  endTime: Dayjs | null;
};

export function ViamCloud(props: ViamCloudProps): JSX.Element {
  const dataClient = props.viamClient?.dataClient;
  const [data, setData] = useState<any>();

  const dateRange: DateRange = {
    startTime: null,
    endTime: null,
  };

  const handleStartTime = (value: Dayjs | null) => {
    dateRange.startTime = value;
  };

  const handleEndTime = (value: Dayjs | null) => {
    dateRange.endTime = value;
  };

  const onSubmit: FormEventHandler = (event) => {
    // Create FilterOptions
    const options: FilterOptions = {
      startTime: new Date(dateRange.startTime?.valueOf() ?? 0),
      endTime: new Date(dateRange.endTime?.valueOf() ?? 0),
    };
    // Create Filter
    const filter = dataClient?.createFilter(options);
    // Query data
    dataClient
      ?.tabularDataByFilter(filter, undefined, undefined, undefined, true)
      .then((data) => {
        setData(data.count);
      });
    event.preventDefault();
  };

  // Query data on component mount
  /*
  useEffect(() => {
    dataClient?.tabularDataByFilter(filter, 1000).then((data) => {
      //setReadings([{ label: "felix", value: data.data }]);
      setData(data.count);
      console.log(JSON.stringify(data));
      return data;
    });
  }, []);
*/
  return (
    <form onSubmit={onSubmit}>
      <div className="flex flex-row">
        <div className="flex flex-col p-4 w-96 space-y-4">
          <DateTimePicker
            label="Start Time"
            value={dateRange.startTime}
            onChange={handleStartTime}
          />
          <DateTimePicker
            label="End Time"
            value={dateRange.endTime}
            className="px-4"
            onChange={handleEndTime}
          />
        </div>
        <button
          type="submit"
          className="rounded self-center border-gray-500 border-2 p-2"
        >
          Run Query
        </button>
      </div>
      <div className="flex flex-row p-4 w-96">
        <p>Total number of measurements: {data}</p>
      </div>
    </form>
  );
}

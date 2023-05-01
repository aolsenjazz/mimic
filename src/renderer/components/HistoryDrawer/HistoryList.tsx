import { ResizeableTable } from '../ResizeableTable';

export type Row = {
  time: string;
  deviceId: string;
  message: NumberArrayWithStatus;
};

type PropTypes = {
  title: string;
  data: Row[];
};

export function HistoryList(props: PropTypes) {
  const { title, data } = props;

  const columns = [
    {
      title: 'Time',
      accessor: 'time',
    },
    {
      title: 'Device',
      accessor: 'deviceId',
    },
    {
      title: 'Message',
      accessor: 'message',
    },
  ];

  return (
    <div className="history-list">
      <h6>{title}</h6>
      <div className="table">
        <ResizeableTable rows={data} columns={columns} />
      </div>
    </div>
  );
}

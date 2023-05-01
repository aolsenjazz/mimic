import { ResizeableTable } from '../ResizeableTable';

export type Row = {
  time: string;
  deviceId: string;
  message: string;
};

type PropTypes = {
  title: string;
  data: Row[];
  doClear: () => void;
};

export function HistoryList(props: PropTypes) {
  const { title, data, doClear } = props;

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
      <div className="top">
        <h6>{title}</h6>
        <p className="clear" onClick={doClear} role="presentation">
          clear
        </p>
      </div>
      <div className="table">
        <ResizeableTable rows={data} columns={columns} />
      </div>
    </div>
  );
}

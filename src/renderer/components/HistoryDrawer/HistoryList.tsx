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

  return (
    <div className="history-list">
      <h6>{title}</h6>
      <div className="table">
        <table>
          <thead>
            <tr>
              <th>Time</th>
              <th>Device</th>
              <th>Message</th>
            </tr>
          </thead>
          <tbody>
            {data.map((d) => {
              return (
                <tr key={`${JSON.stringify(d)}`}>
                  <td>{d.time}</td>
                  <td>{d.deviceId}</td>
                  <td>{JSON.stringify(d.message)}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

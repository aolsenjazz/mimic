type PropTypes = {
  title: string;
};

export default function HistoryList(props: PropTypes) {
  const { title } = props;
  return (
    <div className="history-list">
      <h6>{title}</h6>
      <div className="table"></div>
    </div>
  );
}

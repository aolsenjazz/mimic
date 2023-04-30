import { useState } from 'react';

import DragBoundary from '../DragBoundary';
import HistoryList from './HistoryList';

type PropTypes = {
  show: boolean;
};

export default function HistoryDrawer(props: PropTypes) {
  const { show } = props;

  const [topHeight, setTopHeight] = useState(50);
  const [botHeight, setBotHeight] = useState(50);

  return (
    <div
      className="top-level"
      id="history-drawer"
      style={{ flex: `0 0 ${show ? 300 : 0}px` }}
    >
      <div
        className="table-container"
        style={{ height: `calc(${topHeight}% - 4px)` }}
      >
        <HistoryList title="Sent messages" />
      </div>
      <DragBoundary width="100%" height={6} horizontal={true} />
      <div
        className="table-container"
        style={{ height: `calc(${botHeight}% - 4px)` }}
      >
        {' '}
        <HistoryList title="Received messages" />
      </div>
    </div>
  );
}

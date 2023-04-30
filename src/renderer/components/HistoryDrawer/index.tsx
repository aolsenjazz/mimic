import { useState, useEffect } from 'react';

import DragBoundary from '../DragBoundary';
import { HistoryList, Row } from './HistoryList';

const { deviceService } = window;

function currentTime() {
  const date = new Date();
  const hours = date.getHours().toString().padStart(2, '0');
  const minutes = date.getMinutes().toString().padStart(2, '0');
  const seconds = date.getSeconds().toString().padStart(2, '0');
  const milliseconds = date.getMilliseconds().toString().padStart(3, '0');
  return `${hours}:${minutes}:${seconds}:${milliseconds}`;
}

type PropTypes = {
  show: boolean;
};

export default function HistoryDrawer(props: PropTypes) {
  const { show } = props;

  const [topHeight, setTopHeight] = useState(50);
  const [botHeight, setBotHeight] = useState(50);

  const [sentMessages, setSentMessages] = useState<Row[]>([]);
  const [receivedMessages, setReceivedMessages] = useState<Row[]>([]);

  // listen for confirmation of messages we send
  useEffect(() => {
    const unsubscribe = deviceService.onConfirmation((deviceId, message) => {
      const msg = {
        deviceId,
        message,
        time: currentTime(),
      };
      const trimmed = sentMessages.slice(-1000);
      const msgs = [msg, ...trimmed];

      setSentMessages(msgs);
    });

    return () => unsubscribe();
  });

  // listen for messages we receive
  useEffect(() => {
    const unsubscribe = deviceService.onMsg((deviceId, message) => {
      const msg = {
        deviceId,
        message,
        time: currentTime(),
      };
      const trimmed = receivedMessages.slice(-1000);
      const msgs = [msg, ...trimmed];

      setReceivedMessages(msgs);
    });

    return () => unsubscribe();
  });

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
        <HistoryList title="Sent messages" data={sentMessages} />
      </div>
      <DragBoundary width="100%" height={6} horizontal />
      <div
        className="table-container"
        style={{ height: `calc(${botHeight}% - 4px)` }}
      >
        {' '}
        <HistoryList title="Received messages" data={receivedMessages} />
      </div>
    </div>
  );
}

import { useState, useEffect, useCallback, useRef } from 'react';

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

function bound(n: number, lb: number, hb: number) {
  return Math.max(Math.min(n, hb), lb);
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
  const parent = useRef<HTMLDivElement | null>(null);

  // listen for confirmation of messages we send
  useEffect(() => {
    const unsubscribe = deviceService.onConfirmation((deviceId, message) => {
      const msg = {
        deviceId,
        message: JSON.stringify(message),
        time: currentTime(),
      };
      const trimmed = sentMessages.slice(0, 100);
      const msgs = [msg, ...trimmed];

      setSentMessages(msgs);
    });

    return () => unsubscribe();
  });

  // Listen for messages we receive. It possible to receive messages too quickly to process them
  // one at a time, so we use a queue and process every 100ms
  useEffect(() => {
    let m: Row[] = [];

    const unsubscribe = deviceService.onMsg((deviceId, message) => {
      const msg = {
        deviceId,
        message: JSON.stringify(message),
        time: currentTime(),
      };
      m.push(msg);
    });

    const timer = setInterval(() => {
      if (m.length === 0) return;

      const trimmed = receivedMessages.slice(0, 100);
      const msgs = [...m, ...trimmed];
      setReceivedMessages(msgs);
      m = [];
    }, 100);

    return () => {
      unsubscribe();
      clearInterval(timer);
    };
  }, [receivedMessages, setReceivedMessages]);

  const dragStart = useCallback(
    (_dx: number, dy: number) => {
      if (parent === null) return;

      const parentRect = parent.current?.getBoundingClientRect()!;
      const parentHeight = parentRect.bottom - parentRect.top;
      const dyPercent = (dy / parentHeight) * 100;

      const newTopHeight = bound(topHeight + dyPercent, 30, 70);
      const newBotHeight = bound(botHeight - dyPercent, 30, 70);

      setTopHeight(newTopHeight);
      setBotHeight(newBotHeight);
    },
    [topHeight, setTopHeight, botHeight, setBotHeight]
  );

  return (
    <div
      className="top-level"
      id="history-drawer"
      ref={parent}
      style={{ flex: `0 0 ${show ? 300 : 0}px` }}
    >
      <div>
        <div
          className="table-container"
          style={{ height: `calc(${topHeight}% - 8px)` }}
        >
          <HistoryList
            title="Sent messages"
            data={sentMessages}
            doClear={() => setSentMessages([])}
          />
        </div>
        <DragBoundary width="100%" height={10} horizontal onDrag={dragStart} />
        <div
          className="table-container"
          style={{ height: `calc(${botHeight}% - 8px)` }}
        >
          {' '}
          <HistoryList
            title="Received messages"
            data={receivedMessages}
            doClear={() => setReceivedMessages([])}
          />
        </div>
      </div>
    </div>
  );
}

import { useState, useEffect, useRef } from 'react';
import { Panel, PanelGroup, PanelResizeHandle } from 'react-resizable-panels';

import { HistoryList, Row } from './HistoryList';

const { deviceService, layoutService } = window;

function currentTime() {
  const date = new Date();
  const hours = date.getHours().toString().padStart(2, '0');
  const minutes = date.getMinutes().toString().padStart(2, '0');
  const seconds = date.getSeconds().toString().padStart(2, '0');
  const milliseconds = date.getMilliseconds().toString().padStart(3, '0');
  return `${hours}:${minutes}:${seconds}:${milliseconds}`;
}

export default function HistoryDrawer() {
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
  return (
    <div className="top-level" id="history-drawer" ref={parent}>
      <PanelGroup
        direction="vertical"
        storage={layoutService}
        autoSaveId="history-drawer"
      >
        <Panel className="table-container" minSize={25} id="sent-messages">
          <HistoryList
            title="Sent messages"
            data={sentMessages}
            doClear={() => setSentMessages([])}
          />
        </Panel>
        <PanelResizeHandle
          style={{
            height: 6,
            borderBottom: '1px solid #dbd4d1',
            marginRight: 3,
          }}
        />
        <Panel className="table-container" minSize={25} id="recevied-messages">
          <HistoryList
            title="Received messages"
            data={receivedMessages}
            doClear={() => setReceivedMessages([])}
          />
        </Panel>
      </PanelGroup>
    </div>
  );
}

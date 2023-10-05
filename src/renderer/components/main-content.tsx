import { useEffect, useRef, useState } from 'react';
import { Panel, PanelGroup, PanelResizeHandle } from 'react-resizable-panels';

import { ConnectableDevice } from '@shared/connectable-device';

import TitleBar from './TitleBar';
import DeviceList from './DeviceList';
import HistoryPanel from './HistoryDrawer';
import DevicePanel from './DevicePanel';
import { PanelState, usePanels } from '../context/panel-context';

const { layoutService } = window;

function usePanelEffect(
  panelRef: React.MutableRefObject<null>,
  panelState: PanelState
) {
  useEffect(() => {
    const { collapsed, requiresUpdate } = panelState;
    const ref = panelRef.current;
    if (ref && collapsed && requiresUpdate) {
      (ref as any).collapse();
    } else if (ref && !collapsed && requiresUpdate) {
      (ref as any).expand();
    }
  }, [panelRef, panelState]);
}

type PropTypes = {
  devices: ConnectableDevice[];
  setDevices: (d: ConnectableDevice[]) => void;
};

export default function MainContent(props: PropTypes) {
  const { devices, setDevices } = props;

  const [activeDev, setActiveDev] = useState<ConnectableDevice | undefined>();
  const { panel1State, setPanel1, panel2State, setPanel2 } = usePanels();

  const deviceListPanelRef = useRef(null);
  const historyPanelRef = useRef(null);

  usePanelEffect(deviceListPanelRef, panel1State);
  usePanelEffect(historyPanelRef, panel2State);

  return (
    <>
      <TitleBar />
      <PanelGroup
        direction="horizontal"
        className="main-content"
        storage={layoutService}
        autoSaveId="main-content"
        disablePointerEventsDuringResize
      >
        <Panel
          minSize={20}
          defaultSize={25}
          maxSize={50}
          ref={deviceListPanelRef}
          id="device-list"
          onCollapse={(collapsed) => setPanel1(collapsed, false)}
          collapsible
        >
          <DeviceList
            devices={devices}
            activeDev={activeDev}
            setActiveDev={setActiveDev}
            setDevices={setDevices}
          />
        </Panel>
        <PanelResizeHandle
          className="drag-handle"
          style={{
            borderRight: '1px solid #dbd4d1',
            backgroundColor: '#f4f0f1',
          }}
        />
        <Panel minSize={25} id="main" order={1}>
          <DevicePanel device={activeDev} />
        </Panel>
        <PanelResizeHandle
          className="drag-handle"
          style={{
            borderLeft: '1px solid #dbd4d1',
            backgroundColor: '#f4f0f1',
          }}
        />
        <Panel
          minSize={20}
          ref={historyPanelRef}
          maxSize={50}
          defaultSize={25}
          id="history"
          order={2}
          onCollapse={(collapsed) => setPanel2(collapsed, false)}
          collapsible
        >
          <HistoryPanel />
        </Panel>
      </PanelGroup>
    </>
  );
}

import { useEffect, useState } from 'react';

import { ConnectableDevice } from '@shared/connectable-device';
import { AdapterDevice } from '@shared/adapter-device';
import { parse } from '@shared/util';

import TitleBar from './components/TitleBar';
import DeviceList from './components/DeviceList';
import DevicePanel from './components/DevicePanel';
import MessageListener from './MessageListener';

import './styles/App.global.css';

const { deviceService } = window;

// this looks important
document.body.ondragover = (event) => {
  if (event.dataTransfer) event.dataTransfer.dropEffect = 'move';
  event.preventDefault();
};

export default function App() {
  const [devices, setDevices] = useState<ConnectableDevice[]>([]);
  const [activeDev, setActiveDev] = useState<ConnectableDevice | undefined>();

  // when background intialized devices changes, update here
  useEffect(() => {
    const cb = (jsonString: string) => {
      const devs = parse<ConnectableDevice[]>(jsonString);

      setDevices(
        devs.map((d) => {
          return d.type === 'adapter'
            ? new AdapterDevice(d.driver, d.siblingIndex)
            : new ConnectableDevice(d.driver, d.siblingIndex);
        })
      );
    };

    const unsubscribe = deviceService.onChange(cb);
    return () => unsubscribe();
  }, []);

  return (
    <>
      <TitleBar />
      <div id="main-content">
        <DeviceList
          devices={devices}
          activeDev={activeDev}
          setActiveDev={setActiveDev}
          setDevices={setDevices}
        />
        <DevicePanel device={activeDev} />
        <MessageListener devices={devices} setDevices={setDevices} />
      </div>
    </>
  );
}

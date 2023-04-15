import { useEffect, useState } from 'react';

import { ConnectableDevice } from '../connectable-device';

import TitleBar from './components/TitleBar';
import DeviceList from './components/DeviceList';
import DevicePanel from './components/DevicePanel';

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

  useEffect(() => {
    const unsubscribe = deviceService.onChange((devs) => {
      setDevices(
        devs.map((d) => new ConnectableDevice(d.driver, d.siblingIndex))
      );
    });

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
        />
        <DevicePanel driver={activeDev} />
      </div>
    </>
  );
}

import { useEffect, useState } from 'react';
// import '@shared/connectable-device';

// import * as CD from '@shared/connectable-device';
import { ConnectableDevice } from '@shared/connectable-device';
import * as Revivable from '@shared/revivable';
import { parse } from '@shared/util';

import TitleBar from './components/TitleBar';
import DeviceList from './components/DeviceList';
import DevicePanel from './components/DevicePanel';

import './styles/App.global.css';

const { deviceService } = window;
// const { ConnectableDevice } = CD;

// this looks important
document.body.ondragover = (event) => {
  if (event.dataTransfer) event.dataTransfer.dropEffect = 'move';
  event.preventDefault();
};

export default function App() {
  const [devices, setDevices] = useState<ConnectableDevice[]>([]);
  const [activeDev, setActiveDev] = useState<ConnectableDevice | undefined>();
  console.log(Revivable.GetImplementations());
  // when background intialized devices changes, update here
  useEffect(() => {
    const cb = (jsonString: string) => {
      // console.log(jsonString);
      const devices = parse<ConnectableDevice[]>(jsonString);
      // console.log(jsonString);
      // setDevices(
      //   devs.map((d) => {
      //     return d.type === 'adapter'
      //       ? new AdapterDevice(d.driver, d.siblingIndex)
      //       : new ConnectableDevice(d.driver, d.siblingIndex);
      //   })
      // );
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
      </div>
    </>
  );
}

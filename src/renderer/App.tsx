import { useEffect, useState } from 'react';

import { ConnectableDevice } from '@shared/connectable-device';
import { AdapterDevice } from '@shared/adapter-device';
import { parse } from '@shared/util';

import { PanelProvider } from './context/panel-context';
import MainContent from './components/MainContent';
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

  // when background intialized devices changes, update here
  useEffect(() => {
    const cb = (jsonString: string) => {
      const skeletons = parse<ConnectableDevice[]>(jsonString);
      const devs: ConnectableDevice[] = []; // new list
      const newDevList = skeletons.map((d) => {
        return d.type === 'adapter'
          ? new AdapterDevice(d.driver, d.siblingIndex)
          : new ConnectableDevice(d.driver, d.siblingIndex);
      });
      const currentDevListIds = devices.map((d) => d.id);

      // add existing and/or new devices
      newDevList.forEach((d) => {
        if (currentDevListIds.includes(d.id)) {
          const preexistingDev = devices.filter((pre) => pre.id === d.id)[0];
          devs.push(preexistingDev);
        } else {
          devs.push(d);
        }
      });

      setDevices(devs);
    };

    const unsubscribe = deviceService.onChange(cb);
    return () => unsubscribe();
  }, [devices]);

  return (
    <>
      <PanelProvider>
        <MainContent devices={devices} setDevices={setDevices} />
      </PanelProvider>
      <MessageListener devices={devices} setDevices={setDevices} />
    </>
  );
}

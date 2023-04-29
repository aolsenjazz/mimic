import { useEffect } from 'react';

import { ConnectableDevice } from '@shared/connectable-device';

import NoDevicesView from '../DevicePanel/NoDevicesView';
import DeviceListItem from './DeviceListItem';

type PropTypes = {
  devices: ConnectableDevice[];
  setActiveDev: (dev: ConnectableDevice | undefined) => void;
  setDevices: (dev: ConnectableDevice[]) => void;
  activeDev: ConnectableDevice | undefined;
};

export default function DeviceList(props: PropTypes) {
  const { devices, setActiveDev, activeDev, setDevices } = props;

  // Updated selectedId when anything changes
  useEffect(() => {
    if (activeDev === undefined) {
      // there were no devices last render, update in case there are new devices
      const dev = devices.length > 0 ? devices[0] : undefined;
      setActiveDev(dev);
    } else {
      const isSelectedHere =
        devices.filter((d) => d.id === activeDev.id).length > 0;

      // if the currently-selected device is no longer avail, update
      if (!isSelectedHere) {
        const dev = devices.length === 0 ? undefined : devices[0];
        setActiveDev(dev);
      }
    }
  }, [setActiveDev, activeDev, devices]);

  // Assemble the JSX for device list
  const elements = devices.map((device) => {
    return (
      <DeviceListItem
        key={device.id}
        onClick={() => setActiveDev(device)}
        active={activeDev !== undefined && activeDev.id === device.id}
        device={device}
        setDevices={setDevices}
        devices={devices}
      />
    );
  });

  return (
    <div id="device-list" className="top-level">
      {elements.length > 0 ? elements : <NoDevicesView />}
    </div>
  );
}

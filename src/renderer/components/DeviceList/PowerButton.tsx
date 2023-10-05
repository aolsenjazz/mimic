import { MouseEvent as ReactMouseEvent, useCallback } from 'react';

import Off from '@assets/power_off.svg';
import On from '@assets/power_on.svg';

import { ConnectableDevice } from '@shared/connectable-device';

const { deviceService } = window;

type PropTypes = {
  power: boolean;
  deviceId: string;
  setDevices: (devices: ConnectableDevice[]) => void;
  devices: ConnectableDevice[];
};

export default function PowerButton(props: PropTypes) {
  const { power, setDevices, devices, deviceId } = props;

  const powerOn = useCallback(
    (e: ReactMouseEvent<HTMLDivElement, MouseEvent>) => {
      e.stopPropagation();
      const dev = devices.filter((d) => d.id === deviceId)[0];
      dev.connected = true;
      setDevices([...devices]);
      deviceService.powerOn(deviceId);
    },
    [devices, setDevices, deviceId]
  );

  const powerOff = useCallback(
    (e: ReactMouseEvent<HTMLDivElement, MouseEvent>) => {
      e.stopPropagation();
      const dev = devices.filter((d) => d.id === deviceId)[0];
      dev.connected = false;
      setDevices([...devices]);
      deviceService.powerOff(deviceId);
    },
    [devices, setDevices, deviceId]
  );

  return (
    <div className="power-buton">
      {power ? (
        <img
          src={On}
          alt="on"
          height="14"
          onClick={powerOff}
          role="presentation"
        />
      ) : (
        <img
          src={Off}
          alt="off"
          height="14"
          onClick={powerOn}
          role="presentation"
        />
      )}
    </div>
  );
}

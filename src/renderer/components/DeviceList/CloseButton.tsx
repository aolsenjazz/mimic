import { useCallback } from 'react';

import { ConnectableDevice } from '../../../connectable-device';

const { deviceService } = window;

type PropTypes = {
  deviceId: string;
  setDevices: (devices: ConnectableDevice[]) => void;
  devices: ConnectableDevice[];
};

export default function CloseButton(props: PropTypes) {
  const { deviceId, devices, setDevices } = props;

  const cb = useCallback(() => {
    const newList = devices.filter((d) => d.id !== deviceId);
    setDevices(newList);
    deviceService.remove(deviceId);
  }, [deviceId, devices, setDevices]);

  return (
    <div className="close-button" onClick={cb} role="presentation">
      <span style={{ fontSize: '1.4em' }}>&times;</span>
    </div>
  );
}

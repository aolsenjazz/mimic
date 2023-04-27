import { useEffect } from 'react';

import { ConnectableDevice } from '@shared/connectable-device';
import { create } from '@shared/midi-array';

const { deviceService } = window;

type PropTypes = {
  devices: ConnectableDevice[];
  setDevices: (devices: ConnectableDevice[]) => void;
};

export default function MessageListener(props: PropTypes) {
  const { devices, setDevices } = props;

  useEffect(() => {
    const unsubscribe = deviceService.onMsg(
      (deviceId: string, msg: NumberArrayWithStatus) => {
        const ma = create(msg);
        devices.filter((d) => d.id === deviceId)[0].handleMessage(ma);
        setDevices([...devices]);
      }
    );

    return unsubscribe;
  }, [devices, setDevices]);

  return <div />;
}

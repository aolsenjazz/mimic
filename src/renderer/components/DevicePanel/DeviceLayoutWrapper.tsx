import { ConnectableDevice } from '@shared/connectable-device';

import DeviceLayout from '../DeviceLayout';

type PropTypes = {
  device: ConnectableDevice;
  deviceId: string; // this may be different, if an adapter device is used
};

export default function DeviceLayoutWrapper(
  props: PropTypes
): React.ReactElement {
  const { device, deviceId } = props;
  return (
    <>
      <DeviceLayout device={device} deviceId={deviceId} />
      <div className="warning-container" />
    </>
  );
}

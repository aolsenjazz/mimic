import { ConnectableDevice } from '@shared/connectable-device';

import DeviceLayout from '../DeviceLayout';

type PropTypes = {
  device: ConnectableDevice;
};

export default function DeviceLayoutWrapper(
  props: PropTypes
): React.ReactElement {
  const { device } = props;
  return (
    <>
      <DeviceLayout device={device} />
      <div className="warning-container" />
    </>
  );
}

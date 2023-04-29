import { AdapterDevice } from '@shared/adapter-device';
import { ConnectableDevice } from '@shared/connectable-device';

import UsbView from './UsbView';
import DeviceLayoutWrapper from './DeviceLayoutWrapper';
import HowToConnect from './HowToConnect';

type PropTypes = {
  device: ConnectableDevice | undefined;
};

export default function DevicePanel(props: PropTypes) {
  const { device } = props;

  let Element: React.ReactElement;

  if (device === undefined) {
    Element = <HowToConnect />;
  } else if (device instanceof AdapterDevice) {
    if (device.child === undefined) {
      Element = <UsbView />;
    } else {
      Element = (
        <DeviceLayoutWrapper device={device.child} deviceId={device.id} />
      );
    }
  } else {
    Element = <DeviceLayoutWrapper device={device} deviceId={device.id} />;
  }

  return (
    <div id="device-panel" className="top-level">
      <div className="device-container">{Element}</div>
    </div>
  );
}

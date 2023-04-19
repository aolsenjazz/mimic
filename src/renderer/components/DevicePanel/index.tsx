import { ConnectableDevice } from '@shared/connectable-device';

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
  } else {
    Element = <DeviceLayoutWrapper device={device} />;
  }

  return (
    <div id="device-panel" className="top-level">
      <div className="device-container">{Element}</div>
    </div>
  );
}

import { DeviceDriver } from '@shared/driver-types';

import DeviceLayoutWrapper from './DeviceLayoutWrapper';
import NoDevicesView from './NoDevicesView';

type PropTypes = {
  driver: DeviceDriver | undefined;
};

export default function DevicePanel(props: PropTypes) {
  const { driver } = props;

  let Element: React.ReactElement;

  if (driver === undefined) {
    Element = <NoDevicesView />;
  } else {
    Element = <DeviceLayoutWrapper driver={driver} />;
  }

  return (
    <div id="device-panel" className="top-level">
      <div className="device-container">{Element}</div>
    </div>
  );
}

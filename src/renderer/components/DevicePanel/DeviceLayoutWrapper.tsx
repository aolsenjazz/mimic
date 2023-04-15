import { DeviceDriver } from '@shared/driver-types';

import DeviceLayout from '../DeviceLayout';

type PropTypes = {
  driver: DeviceDriver;
};

export default function DeviceLayoutWrapper(
  props: PropTypes
): React.ReactElement {
  const { driver } = props;
  return (
    <>
      <DeviceLayout driver={driver} />
      <div className="warning-container"></div>
    </>
  );
}

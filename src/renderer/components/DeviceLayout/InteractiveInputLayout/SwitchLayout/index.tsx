import { SwitchImpl } from '@shared/input-impl';

import VerticalSwitchLayout from './SwitchLayout';
import HorizontalSwitchlayout from './HorizontalSwitchLayout';

type PropTypes = {
  input: SwitchImpl;
  deviceId: string;
};

export default function SwitchInput(props: PropTypes) {
  const { input, deviceId } = props;

  return input.horizontal === true ? (
    <HorizontalSwitchlayout deviceId={deviceId} input={input} />
  ) : (
    <VerticalSwitchLayout deviceId={deviceId} input={input} />
  );
}

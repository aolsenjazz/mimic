import { SwitchImpl } from '@shared/input-impl';

import VerticalSwitchLayout from './SwitchLayout';

type PropTypes = {
  input: SwitchImpl;
  deviceId: string;
};

export default function SwitchInput(props: PropTypes) {
  const { input, deviceId } = props;

  // TODO: normally, we'd use a HorizontalSwitchLayout. Not yet built
  return input.horizontal === true ? (
    <VerticalSwitchLayout deviceId={deviceId} input={input} />
  ) : (
    <VerticalSwitchLayout deviceId={deviceId} input={input} />
  );
}

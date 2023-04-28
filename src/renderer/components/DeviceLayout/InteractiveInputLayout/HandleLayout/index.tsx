import { HandleInputImpl } from '@shared/input-impl';

import VerticalHandleLayout from './HandleLayout';
import HorizontalHandleLayout from './HorizontalHandleLayout';

type PropTypes = {
  input: HandleInputImpl;
  deviceId: string;
};

export default function HandleLayout(props: PropTypes) {
  const { input, deviceId } = props;

  return input.horizontal === true ? (
    <HorizontalHandleLayout deviceId={deviceId} input={input} />
  ) : (
    <VerticalHandleLayout deviceId={deviceId} input={input} />
  );
}

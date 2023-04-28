import {
  PadImpl,
  KnobInputImpl,
  SwitchImpl,
  HandleInputImpl,
  InteractiveInputImpl,
} from '@shared/input-impl';

import Pad from './PadLayout';
import KnobLayout from './KnobLayout';
import HandleLayout from './HandleLayout';
import { SwitchLayout } from './SwitchLayout';

type InputLayoutPropTypes = {
  deviceId: string;
  input: InteractiveInputImpl;
};

export default function InteractiveInputLayout(props: InputLayoutPropTypes) {
  const { deviceId, input } = props;

  if (input instanceof PadImpl) {
    return <Pad deviceId={deviceId} pad={input} />;
  }

  if (input instanceof KnobInputImpl) {
    return <KnobLayout deviceId={deviceId} input={input} />;
  }

  if (input instanceof SwitchImpl) {
    return <SwitchLayout deviceId={deviceId} input={input} />;
  }

  const handleImpl = input as HandleInputImpl;
  return <HandleLayout deviceId={deviceId} input={handleImpl} />;
}

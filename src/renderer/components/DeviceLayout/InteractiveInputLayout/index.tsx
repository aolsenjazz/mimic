import {
  InteractiveInputDriver,
  InputDriverWithHandle,
  SwitchDriver,
} from '@shared/driver-types';
import { KnobDriver } from '@shared/driver-types/input-drivers';

import Pad from './PadLayout';
import { Knob } from './KnobLayout';
import { WheelLayout } from './WheelLayout';
import { SwitchLayout } from './SwitchLayout';

type InputLayoutPropTypes = {
  driver: InteractiveInputDriver;
};

export default function InteractiveInputLayout(props: InputLayoutPropTypes) {
  const { driver } = props;

  if (driver.type === 'pad') {
    return <Pad shape={driver.shape} />;
  }

  if (driver.type === 'knob') {
    const asKnob = driver as KnobDriver;
    return (
      <Knob
        value={0}
        shape={driver.shape}
        endless={asKnob.knobType === 'endless'}
      />
    );
  }

  if (driver.type === 'switch') {
    const asSwitch = driver as SwitchDriver;
    const { steps } = asSwitch;

    return <SwitchLayout steps={steps} style={driver.style} />;
  }

  const handleWidth = (driver as InputDriverWithHandle).handleWidth as number;
  return (
    <WheelLayout
      value={0}
      handleWidth={`${(handleWidth / driver.width) * 100}%`}
      handleHeight={`${(handleWidth / driver.height) * 100}%`}
      style={driver.style}
    />
  );
}

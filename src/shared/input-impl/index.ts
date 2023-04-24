import {
  InputDriver,
  NoninteractiveInputDriver,
  SwitchDriver,
  InputDriverWithHandle,
} from '@shared/driver-types';
import { KnobDriver, PadDriver } from '@shared/driver-types/input-drivers';

import { HandleInputImpl } from './handle-input-impl';
import { InteractiveInputImpl } from './interactive-input-impl';
import { KnobInputImpl } from './knob-input-impl';
import { NoninteractiveInputImpl } from './noninteractive-input-impl';
import { PadImpl } from './pad-impl';
import { SwitchImpl } from './switch-impl';
import { BaseInputImpl } from './base-input-impl';

export {
  HandleInputImpl,
  InteractiveInputImpl,
  KnobInputImpl,
  NoninteractiveInputImpl,
  PadImpl,
  SwitchImpl,
  BaseInputImpl,
};

export function create(driver: InputDriver): BaseInputImpl {
  if (driver.interactive === false)
    return new NoninteractiveInputImpl(driver as NoninteractiveInputDriver);
  if (driver.type === 'knob') return new KnobInputImpl(driver as KnobDriver);
  if (driver.type === 'switch') return new SwitchImpl(driver as SwitchDriver);
  if (driver.type === 'pad') return new PadImpl(driver as PadDriver);

  return new HandleInputImpl(driver as InputDriverWithHandle);
}

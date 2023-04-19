import { PadDriver } from '@shared/driver-types/input-drivers';
import { InteractiveInputImpl } from './interactive-input-impl';

export class PadImpl
  extends InteractiveInputImpl<PadDriver>
  implements PadDriver
{
  get type() {
    return 'pad' as const;
  }

  get value() {
    return this.driver.value;
  }
}

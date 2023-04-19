import { KnobDriver } from '@shared/driver-types/input-drivers';
import { InteractiveInputImpl } from './interactive-input-impl';

export class KnobInputImpl
  extends InteractiveInputImpl<KnobDriver>
  implements KnobDriver
{
  get type() {
    return 'knob' as const;
  }

  get response() {
    return 'continuous' as const;
  }

  get knobType() {
    return this.driver.knobType;
  }
}

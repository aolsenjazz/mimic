import { KnobDriver } from '@shared/driver-types/input-drivers';
import { create } from '@shared/midi-array';

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

  midiArray(value: MidiNumber) {
    if (this.status === 'noteon/noteoff') throw new Error(); // satisfy compiler
    return create(this.status, this.channel, this.number, value);
  }
}

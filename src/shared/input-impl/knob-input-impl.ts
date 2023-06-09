import { KnobDriver } from '@shared/driver-types/input-drivers';
import { create } from '@shared/midi-array';

import { MonoInteractiveImpl } from './mono-interactive-input-impl';

export class KnobInputImpl
  extends MonoInteractiveImpl<KnobDriver>
  implements KnobDriver
{
  value?: MidiNumber;

  constructor(driver: KnobDriver) {
    super(driver);

    this.value = driver.knobType === 'absolute' ? 127 : undefined;
  }

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
    if (this.knobType === 'absolute') this.value = value;
    return create(this.status, this.channel, this.number, value);
  }
}

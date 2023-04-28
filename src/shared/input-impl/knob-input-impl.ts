import { KnobDriver } from '@shared/driver-types/input-drivers';
import { create, MidiArray, ThreeByteMidiArray } from '@shared/midi-array';

import { InteractiveInputImpl } from './interactive-input-impl';

export class KnobInputImpl
  extends InteractiveInputImpl<KnobDriver>
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

  applySentMessage(msg: MidiArray) {
    this.value = (msg as ThreeByteMidiArray).value;
  }
}

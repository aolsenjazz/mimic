import { InputDriverWithHandle } from '@shared/driver-types';
import { register } from '@shared/revivable';
import { create } from '@shared/midi-array';

import { MonoInteractiveImpl } from './mono-interactive-input-impl';

@register
export class HandleInputImpl
  extends MonoInteractiveImpl<InputDriverWithHandle>
  implements InputDriverWithHandle
{
  value: MidiNumber = 127;

  constructor(driver: InputDriverWithHandle, value?: MidiNumber) {
    super(driver);

    if (value !== undefined) {
      this.value = value;
    } else {
      this.value = driver.status === 'pitchbend' ? 64 : 127;
    }
  }

  toJSON() {
    return {
      name: this.constructor.name,
      args: [this.driver, this.value],
    };
  }

  get type() {
    return this.driver.type;
  }

  get response() {
    return this.driver.response;
  }

  get handleWidth() {
    return this.driver.handleWidth;
  }

  get handleHeight() {
    return this.driver.handleHeight;
  }

  get horizontal() {
    return this.driver.horizontal;
  }

  get inverted() {
    return this.driver.inverted;
  }

  midiArray(value: MidiNumber) {
    if (this.status === 'noteon/noteoff') throw new Error(); // satisfy compiler
    this.value = value;
    return create(this.status, this.channel, this.number, this.value);
  }
}

import { InputDriverWithHandle } from '@shared/driver-types';
import { register } from '@shared/revivable';
import { create } from '@shared/midi-array';

import { InteractiveInputImpl } from './interactive-input-impl';

@register
export class HandleInputImpl
  extends InteractiveInputImpl<InputDriverWithHandle>
  implements InputDriverWithHandle
{
  value: MidiNumber = 127;

  constructor(driver: InputDriverWithHandle, value?: MidiNumber) {
    super(driver);
    this.value = value || this.value;
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

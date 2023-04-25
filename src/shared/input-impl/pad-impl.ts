import { PadDriver } from '@shared/driver-types/input-drivers';
import { create, MidiArray } from '@shared/midi-array';

import { InteractiveInputImpl } from './interactive-input-impl';

export class PadImpl
  extends InteractiveInputImpl<PadDriver>
  implements PadDriver
{
  value?: MidiNumber;

  protected toggleValue: 0 | 127 = 127;

  protected cb?: (msg: MidiArray) => void;

  constructor(driver: PadDriver) {
    super(driver);

    this.value = driver.value;
  }

  get type() {
    return 'pad' as const;
  }

  press() {
    if (this.cb) {
      this.cb(this.updateState());
    }
  }

  release() {
    if (this.response === 'gate' && this.cb) {
      this.cb(this.updateState());
    }
  }

  onTransmit(cb: (msg: MidiArray) => void) {
    this.cb = cb;
  }

  midiArray(noteStatus?: 'noteon' | 'noteoff') {
    const status = this.status === 'noteon/noteoff' ? noteStatus : this.status;

    if (status === undefined)
      throw new Error('must provide noteStatus when type === noteon/noteoff');

    return create(status, this.channel, this.number, this.value);
  }

  protected updateState() {
    // if this value toggles between 'on' and 'off' states, toggle
    let { value, status } = this;
    if (this.requiresToggle) {
      value = this.toggleValue;

      this.toggleValue = this.toggleValue === 127 ? 0 : 127;

      if (status === 'noteon/noteoff') {
        status = value === 127 ? 'noteon' : 'noteoff';
      }
    }

    if (status === 'noteon/noteoff') throw new Error(); // satisfy the compiler

    return create(status, this.channel, this.number, value);
  }

  protected get requiresToggle() {
    return (
      (this.response !== 'constant' && this.status === 'controlchange') ||
      this.status === 'noteon/noteoff'
    );
  }
}

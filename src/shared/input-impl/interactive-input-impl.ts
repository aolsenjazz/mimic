import { InteractiveInputDriver } from '@shared/driver-types';
import { register, Skeleton } from '@shared/revivable';
import { MidiArray } from '@shared/midi-array';

import { BaseInputImpl } from './base-input-impl';

@register
export class InteractiveInputImpl<
    T extends InteractiveInputDriver = InteractiveInputDriver
  >
  extends BaseInputImpl<T>
  implements InteractiveInputDriver
{
  toJSON(): Skeleton {
    return {
      name: this.constructor.name,
      args: [this.driver],
    };
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  handleMessage(_msg: MidiArray) {}

  get interactive() {
    return true as const;
  }

  get response() {
    return this.driver.response;
  }

  get number() {
    return this.driver.number;
  }

  get channel() {
    return this.driver.channel;
  }

  get status() {
    return this.driver.status;
  }

  get availableColors() {
    return this.driver.availableColors;
  }

  get availableFx() {
    return this.driver.availableFx;
  }
}

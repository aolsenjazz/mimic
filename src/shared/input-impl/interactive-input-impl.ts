import { InteractiveInputDriver } from '@shared/driver-types/input-drivers';
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
}

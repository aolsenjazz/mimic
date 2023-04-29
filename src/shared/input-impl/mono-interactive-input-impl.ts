import { MonoInteractiveDriver } from '@shared/driver-types/input-drivers';
import { register, Skeleton } from '@shared/revivable';

import { InteractiveInputImpl } from './interactive-input-impl';

@register
export class MonoInteractiveImpl<
    T extends MonoInteractiveDriver = MonoInteractiveDriver
  >
  extends InteractiveInputImpl<T>
  implements MonoInteractiveDriver
{
  toJSON(): Skeleton {
    return {
      name: this.constructor.name,
      args: [this.driver],
    };
  }

  get type() {
    return this.driver.type;
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

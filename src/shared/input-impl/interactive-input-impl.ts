import { InteractiveInputDriver } from '@shared/driver-types';
import { register } from '@shared/revivable';
import { BaseInputImpl } from './base-input-impl';

@register
export class InteractiveInputImpl<
    T extends InteractiveInputDriver = InteractiveInputDriver
  >
  extends BaseInputImpl<T>
  implements InteractiveInputDriver
{
  toJSON() {
    return {
      name: this.constructor.name,
      args: [this.driver],
    };
  }

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

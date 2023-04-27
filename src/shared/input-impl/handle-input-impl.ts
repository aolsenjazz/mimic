import { InputDriverWithHandle } from '@shared/driver-types';
import { register } from '@shared/revivable';
import { InteractiveInputImpl } from './interactive-input-impl';

@register
export class HandleInputImpl
  extends InteractiveInputImpl<InputDriverWithHandle>
  implements InputDriverWithHandle
{
  toJSON() {
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
}

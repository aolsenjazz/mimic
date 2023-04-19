import { NoninteractiveInputDriver } from '@shared/driver-types';
import { register } from '@shared/revivable';
import { BaseInputImpl } from './base-input-impl';

@register
export class NoninteractiveInputImpl
  extends BaseInputImpl<NoninteractiveInputDriver>
  implements NoninteractiveInputDriver
{
  toJSON() {
    return {
      name: this.constructor.name,
      args: [this.driver],
    };
  }

  get interactive() {
    return false as const;
  }

  get handleWidth() {
    return this.driver.handleWidth;
  }

  get handleHeight() {
    return this.driver.handleHeight;
  }
}

import { InputDriver } from '@shared/driver-types';
import { register, Skeleton } from '@shared/revivable';

@register
export class BaseInputImpl<T extends InputDriver = InputDriver>
  implements InputDriver
{
  driver: T;

  constructor(driver: T) {
    this.driver = driver;
  }

  toJSON(): Skeleton {
    return {
      name: this.constructor.name,
      args: [this.driver],
    };
  }

  get shape() {
    return this.driver.shape;
  }

  get type() {
    return this.driver.type;
  }

  get interactive() {
    return this.driver.interactive;
  }

  get height() {
    return this.driver.height;
  }

  get width() {
    return this.driver.width;
  }
}

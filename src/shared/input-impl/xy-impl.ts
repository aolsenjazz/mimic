import { XYDriver } from '@shared/driver-types/input-drivers';
import { register, Skeleton } from '@shared/revivable';
import { HandleInputImpl } from './handle-input-impl';

import { InteractiveInputImpl } from './interactive-input-impl';

@register
export class XYImpl extends InteractiveInputImpl<XYDriver> implements XYDriver {
  x: HandleInputImpl;

  y: HandleInputImpl;

  constructor(d: XYDriver, x?: HandleInputImpl, y?: HandleInputImpl) {
    super(d);

    this.x = x || new HandleInputImpl(d.x);
    this.y = y || new HandleInputImpl(d.y);
  }

  toJSON(): Skeleton {
    return {
      name: this.constructor.name,
      args: [this.driver, this.x, this.y],
    };
  }

  get type() {
    return 'xy' as const;
  }
}

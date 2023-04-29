import { DeviceDriver } from '@shared/driver-types';
import { register } from '@shared/revivable';
import { ConnectableDevice } from './connectable-device';

@register
export class AdapterDevice extends ConnectableDevice {
  child?: ConnectableDevice;

  constructor(
    driver: DeviceDriver,
    siblingIndex: number,
    child?: ConnectableDevice
  ) {
    super(driver, siblingIndex);
    this.child = child;
  }

  toJSON() {
    return {
      name: this.constructor.name,
      args: [this.driver, this.siblingIndex, this.child || []],
    };
  }

  get connected() {
    return this.conn;
  }

  set connected(connected: boolean) {
    this.conn = connected;

    if (this.child !== undefined) {
      this.child.connected = connected;
    }
  }

  get name() {
    return this.driver.name;
  }

  get type() {
    return this.driver.type;
  }

  get anonymous() {
    return this.child?.anonymous || this.driver.anonymous;
  }

  get width() {
    return this.child?.width || this.driver.width;
  }

  get height() {
    return this.child?.height || this.driver.height;
  }

  get controlSequence() {
    return this.child?.controlSequence || this.driver.controlSequence;
  }

  get inputGrids() {
    return this.child?.inputGrids || this.driver.inputGrids;
  }

  get style() {
    return this.child?.style || this.driver.style;
  }
}

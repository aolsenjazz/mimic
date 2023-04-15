import { DeviceDriver } from '@shared/driver-types';
import { ConnectableDevice } from './connectable-device';

export class AdapterDevice extends ConnectableDevice {
  child?: DeviceDriver;

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

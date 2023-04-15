import { DeviceDriver } from '@shared/driver-types';

export class ConnectableDevice implements DeviceDriver {
  connected = true;

  driver: DeviceDriver;

  siblingIndex: number;
  id: string;

  constructor(driver: DeviceDriver, siblingIndex: number) {
    this.driver = driver;
    this.siblingIndex = siblingIndex;
    this.id = `${driver.name} ${siblingIndex}`;
  }

  get name() {
    return this.driver.name;
  }

  get type() {
    return this.driver.type;
  }

  get anonymous() {
    return this.driver.anonymous;
  }

  get width() {
    return this.driver.width;
  }

  get height() {
    return this.driver.height;
  }

  get controlSequence() {
    return this.driver.controlSequence;
  }

  get inputGrids() {
    return this.driver.inputGrids;
  }

  get style() {
    return this.driver.style;
  }
}

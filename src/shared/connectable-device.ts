import { DeviceDriver } from '@shared/driver-types';
import * as Revivable from '@shared/revivable';

import { InputGridImpl } from './input-grid-impl';

console.log('ayoooo');

@Revivable.register
export class ConnectableDevice implements DeviceDriver {
  connected = true;

  driver: DeviceDriver;

  siblingIndex: number;

  id: string;

  inputGridImpls: InputGridImpl[];

  constructor(
    driver: DeviceDriver,
    siblingIndex: number,
    grids?: InputGridImpl[]
  ) {
    this.driver = driver;
    this.siblingIndex = siblingIndex;
    this.id = `${driver.name} ${siblingIndex}`;

    this.inputGridImpls =
      grids || this.inputGrids.map((ig) => new InputGridImpl(ig));
  }

  toJSON() {
    return {
      name: this.constructor.name,
      args: [this.driver, this.siblingIndex, this.inputGridImpls],
    };
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

  get keyboard() {
    return this.driver.keyboard;
  }
}

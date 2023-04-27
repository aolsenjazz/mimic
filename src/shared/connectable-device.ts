import { DeviceDriver } from '@shared/driver-types';
import { register } from '@shared/revivable';
import { MidiArray } from '@shared/midi-array';
import { id } from '@shared/util';
import { InteractiveInputImpl } from './input-impl';

import { InputGridImpl } from './input-grid-impl';

@register
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

  handleMessage(msg: MidiArray) {
    this.inputGridImpls
      .flatMap((ig) => ig.inputImpls)
      .filter((i) => i instanceof InteractiveInputImpl)
      .filter((i) => id(i as InteractiveInputImpl) === msg.id(true))
      .forEach((i) => {
        (i as InteractiveInputImpl).handleMessage(msg);
      });
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

import { InputGridDriver } from '@shared/driver-types';
import { BaseInputImpl, create } from '@shared/input-impl';
import * as Revivable from '@shared/revivable';

@Revivable.register
export class InputGridImpl implements InputGridDriver {
  driver: InputGridDriver;

  inputImpls: BaseInputImpl[];

  constructor(driver: InputGridDriver, inputs?: BaseInputImpl[]) {
    this.driver = driver;
    this.inputImpls = inputs || driver.inputs.map((i) => create(i));
  }

  toJSON() {
    return {
      name: this.constructor.name,
      args: [this.driver, this.inputImpls],
    };
  }

  get id() {
    return this.driver.id;
  }

  get height() {
    return this.driver.height;
  }

  get width() {
    return this.driver.width;
  }

  get nRows() {
    return this.driver.nRows;
  }

  get nCols() {
    return this.driver.nCols;
  }

  get left() {
    return this.driver.left;
  }

  get bottom() {
    return this.driver.bottom;
  }

  get style() {
    return this.driver.style;
  }

  get inputs() {
    return this.driver.inputs;
  }
}

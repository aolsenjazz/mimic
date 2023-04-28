import { SwitchDriver } from '@shared/driver-types';
import { register } from '@shared/revivable';
import { create } from '@shared/midi-array';

import { InteractiveInputImpl } from './interactive-input-impl';

@register
export class SwitchImpl
  extends InteractiveInputImpl<SwitchDriver>
  implements SwitchDriver
{
  currentStep: number;

  constructor(driver: SwitchDriver) {
    super(driver);

    this.currentStep = this.initialStep;
  }

  midiArray(step: number) {
    this.currentStep = step;

    return create(this.steps[step]);
  }

  get type() {
    return 'switch' as const;
  }

  get response() {
    return 'enumerated' as const;
  }

  get steps() {
    return this.driver.steps;
  }

  get stepLabels() {
    return this.driver.stepLabels;
  }

  get sequential() {
    return this.driver.sequential;
  }

  get initialStep() {
    return this.driver.initialStep;
  }

  get horizontal() {
    return this.driver.horizontal;
  }

  get inverted() {
    return this.driver.inverted;
  }
}

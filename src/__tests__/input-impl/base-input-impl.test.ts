import { BaseInputImpl } from '@shared/input-impl';
import { parse, stringify } from '@shared/util';
import { DRIVERS } from '@shared/drivers';

const APC = DRIVERS.get('APC Key 25')!;
const INPUT = APC.inputGrids[0].inputs[0];

describe('toJSON', () => {
  test('de/serializes automagically', () => {
    const i = new BaseInputImpl(INPUT);
    const json = stringify(i);
    const obj = parse<BaseInputImpl>(json);

    expect(JSON.stringify(obj)).toEqual(JSON.stringify(i));
  });

  test('de/serializes array correctly', () => {
    const i = new BaseInputImpl(INPUT);
    const arr = [i, i];
    const json = stringify(arr);
    const obj = parse<BaseInputImpl>(json);

    expect(JSON.stringify(obj)).toEqual(JSON.stringify(arr));
  });
});

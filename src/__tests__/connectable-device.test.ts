import { ConnectableDevice } from '@shared/connectable-device';
import { parse, stringify } from '@shared/util';
import { DRIVERS } from '@shared/drivers';

const APC = DRIVERS.get('APC Key 25')!;

describe('toJSON', () => {
  test('de/serializes automagically', () => {
    const i = new ConnectableDevice(APC, 0);
    const json = stringify(i);
    const obj = parse<ConnectableDevice>(json);

    expect(JSON.stringify(obj)).toEqual(JSON.stringify(i));
  });

  test('de/serializes array correctly', () => {
    const i = new ConnectableDevice(APC, 0);
    const i2 = new ConnectableDevice(APC, 1);
    const arr = [i, i2];
    const json = stringify(arr);

    const obj = parse<ConnectableDevice>(json);

    expect(JSON.stringify(obj)).toEqual(JSON.stringify(arr));
  });
});

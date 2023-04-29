import { useCallback } from 'react';

import { AdapterDevice } from '@shared/adapter-device';
import { ConnectableDevice } from '@shared/connectable-device';
import { DRIVERS } from '@shared/drivers';

import BasicSelect from '../BasicSelect';

const fivePins = new Map(
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  Array.from(DRIVERS.entries()).filter(([_k, d]) => d.type === '5pin')
);

type PropTypes = {
  device: AdapterDevice;
  setDevices: (devices: ConnectableDevice[]) => void;
  devices: ConnectableDevice[];
};

export default function FivePinDropdown(props: PropTypes) {
  const { device, setDevices, devices } = props;

  const valueList = Array.from(fivePins.keys());
  const labelList = Array.from(fivePins.keys());
  const value = device.child ? device.child.name : '';

  const onChange = useCallback(
    (v: string | number) => {
      const childDriver = DRIVERS.get(v as string);
      const childImpl = new ConnectableDevice(
        childDriver!,
        device.siblingIndex
      );
      device.child = childImpl;

      const spliced = [...devices].filter((d) => d.id !== device.id);
      spliced.push(device);
      setDevices(spliced);
    },
    [device, setDevices, devices]
  );

  return (
    <BasicSelect
      valueList={valueList}
      labelList={labelList}
      value={value}
      onChange={onChange}
      placeholder="Choose your device"
    />
  );
}

import { DeviceDriver } from '@shared/driver-types';

import Keyboard from './KeyboardLayout';
import InputGridLayout from './InputGridLayout';
import XYGridLayout from './XYGridLayout';

type PropTypes = {
  driver: DeviceDriver;
};

export default function DeviceLayout(props: PropTypes) {
  const { driver } = props;

  const Element = (
    <div id={driver.name} className="device-root">
      {driver.keyboard ? (
        <Keyboard
          nOctaves={driver.keyboard.nOctaves}
          width={driver.keyboard.width}
          height={driver.keyboard.height}
          left={driver.keyboard.left}
          bottom={driver.keyboard.bottom}
          deviceWidth={driver.width}
          deviceHeight={driver.height}
          enabled={driver.keyboard.enabled}
        />
      ) : null}

      {driver.inputGrids.map((inputGrid) => {
        const xyChildren = inputGrid.inputs.filter((i) => i.type === 'xy');
        const isMultiInput = xyChildren.length === 2;

        return isMultiInput ? (
          <XYGridLayout
            key={inputGrid.id}
            inputGrid={inputGrid}
            deviceWidth={driver.width}
            deviceHeight={driver.height}
          />
        ) : (
          <InputGridLayout
            key={inputGrid.id}
            inputGrid={inputGrid}
            deviceWidth={driver.width}
            deviceHeight={driver.height}
          />
        );
      })}
    </div>
  );

  return (
    <div
      style={{
        '--r': `${driver.width}/${driver.height}`,
        ...driver.style,
      }}
      className="device-layout"
    >
      {Element}
    </div>
  );
}

import { ConnectableDevice } from '@shared/connectable-device';

import Keyboard from './KeyboardLayout';
import InputGridLayout from './InputGridLayout';
import XYGridLayout from './XYGridLayout';

type PropTypes = {
  device: ConnectableDevice;
};

export default function DeviceLayout(props: PropTypes) {
  const { device } = props;

  const Element = (
    <div id={device.name} className="device-root">
      {device.keyboard ? (
        <Keyboard
          nOctaves={device.keyboard.nOctaves}
          width={device.keyboard.width}
          height={device.keyboard.height}
          left={device.keyboard.left}
          bottom={device.keyboard.bottom}
          deviceWidth={device.width}
          deviceHeight={device.height}
        />
      ) : null}

      {device.inputGridImpls.map((inputGrid) => {
        const xyChildren = inputGrid.inputs.filter((i) => i.type === 'xy');
        const isMultiInput = xyChildren.length === 2;

        return isMultiInput ? (
          <XYGridLayout
            key={inputGrid.id}
            inputGrid={inputGrid}
            deviceWidth={device.width}
            deviceHeight={device.height}
          />
        ) : (
          <InputGridLayout
            key={inputGrid.id}
            deviceId={device.id}
            grid={inputGrid}
            deviceWidth={device.width}
            deviceHeight={device.height}
          />
        );
      })}
    </div>
  );

  return (
    <div
      style={{
        '--r': `${device.width}/${device.height}`,
        ...device.style,
      }}
      className={`device-layout ${device.connected ? 'connected' : ''}`}
    >
      {Element}
    </div>
  );
}

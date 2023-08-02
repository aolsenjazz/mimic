import { ConnectableDevice } from '@shared/connectable-device';

import Keyboard from './KeyboardLayout';
import InputGridLayout from './InputGridLayout';

type PropTypes = {
  device: ConnectableDevice;
  deviceId: string;
};

export default function DeviceLayout(props: PropTypes) {
  const { device, deviceId } = props;

  return (
    <div
      style={{
        aspectRatio: `${device.width}/${device.height}`,
        ...device.style,
      }}
      className={`device-layout ${device.connected ? 'connected' : ''}`}
    >
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
            channel={device.keyboard.channel}
            defaultOctave={device.keyboard.defaultOctave}
            deviceId={deviceId}
            enabled={device.keyboard.enabled}
          />
        ) : null}

        {device.inputGridImpls.map((inputGrid) => {
          return (
            <InputGridLayout
              key={inputGrid.id}
              deviceId={deviceId}
              grid={inputGrid}
              deviceWidth={device.width}
              deviceHeight={device.height}
            />
          );
        })}
      </div>
    </div>
  );
}

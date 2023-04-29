import { AdapterDevice } from '@shared/adapter-device';
import { ConnectableDevice } from '@shared/connectable-device';

import FivePinDropdown from './FivePinDropdown';
import DeviceIcon from '../DeviceIcon';
import CloseButton from './CloseButton';
import PowerButton from './PowerButton';

function cssClassFor(connected: boolean) {
  return connected ? 'connected' : 'disconnected';
}

function statusFor(connected: boolean) {
  return connected ? 'Connected' : 'Disconnected';
}

type PropTypes = {
  device: ConnectableDevice;
  onClick: () => void;
  active: boolean;
  setDevices: (devices: ConnectableDevice[]) => void;
  devices: ConnectableDevice[];
};

export default function DeviceListItem(props: PropTypes) {
  const { onClick, active, devices, setDevices, device } = props;

  return (
    <div className={`device-list-item ${active ? 'active' : ''}`}>
      <div className="device-icon-container">
        <DeviceIcon driver={device.driver} active={active} />
      </div>
      <div
        className="device-list-item-label"
        onClick={onClick}
        role="button"
        tabIndex={0}
        onKeyDown={onClick}
      >
        <div className="heading-line">
          <h2>{device.name}</h2>
          <div className="heading-line-controls">
            <PowerButton
              power={device.connected}
              setDevices={setDevices}
              devices={devices}
              deviceId={device.id}
            />
            <CloseButton deviceId={device.id} />
          </div>
        </div>
        {device instanceof AdapterDevice ? (
          <FivePinDropdown
            device={device}
            setDevices={setDevices}
            devices={devices}
          />
        ) : null}
        <div className={`connection-color ${cssClassFor(device.connected)}`} />
        <p className="connection-status">{statusFor(device.connected)}</p>
      </div>
    </div>
  );
}

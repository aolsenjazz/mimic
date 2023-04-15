import { DeviceDriver } from '@shared/driver-types';

import { ConnectableDevice } from '../../../connectable-device';

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
  name: string;
  id: string;
  onClick: () => void;
  active: boolean;
  connected: boolean;
  driver: DeviceDriver;
  setDevices: (devices: ConnectableDevice[]) => void;
  devices: ConnectableDevice[];
};

export default function DeviceListItem(props: PropTypes) {
  const { onClick, active, connected, name, id, driver, devices, setDevices } =
    props;

  return (
    <div className={`device-list-item ${active ? 'active' : ''}`}>
      <div className="device-icon-container">
        <DeviceIcon driver={driver} active={active} />
      </div>
      <div
        className="device-list-item-label"
        onClick={onClick}
        role="button"
        tabIndex={0}
        onKeyDown={onClick}
      >
        <div className="heading-line">
          <h2>{name}</h2>
          <div className="heading-line-controls">
            <PowerButton
              power={connected}
              setDevices={setDevices}
              devices={devices}
              deviceId={id}
            />
            <CloseButton deviceId={id} />
          </div>
        </div>
        <div className={`connection-color ${cssClassFor(connected)}`} />
        <p className="connection-status">{statusFor(connected)}</p>
      </div>
    </div>
  );
}

import { DeviceDriver } from '@shared/driver-types';

import DeviceIcon from './DeviceIcon';

function cssClassFor(connected: boolean) {
  return connected ? 'connected' : 'disconnected';
}

function statusFor(connected: boolean) {
  return connected ? 'Connected' : 'Disconnected';
}

function reformatId(id: string, siblingIndex: number) {
  const lastSpaceIdx = id.lastIndexOf(' ');
  const deviceName = id.substring(0, lastSpaceIdx);

  return siblingIndex === 0 ? deviceName : `${deviceName} (${siblingIndex})`;
}

type PropTypes = {
  name: string;
  id: string;
  siblingIndex: number;
  onClick: () => void;
  active: boolean;
  connected: boolean;
  driver: DeviceDriver;
};

export default function DeviceListItem(props: PropTypes) {
  const { onClick, active, connected, name, siblingIndex, id, driver } = props;

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
        <h2>{name}</h2>
        <p className="id">{reformatId(id, siblingIndex)}</p>
        <div className={`connection-color ${cssClassFor(connected)}`} />
        <p className="connection-status">{statusFor(connected)}</p>
      </div>
    </div>
  );
}

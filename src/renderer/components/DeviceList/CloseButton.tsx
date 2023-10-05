import { MouseEvent as ReactMouseEvent, useCallback } from 'react';

const { deviceService } = window;

type PropTypes = {
  deviceId: string;
};

export default function CloseButton(props: PropTypes) {
  const { deviceId } = props;

  const cb = useCallback(
    (e: ReactMouseEvent<HTMLDivElement, MouseEvent>) => {
      e.stopPropagation();
      deviceService.remove(deviceId);
    },
    [deviceId]
  );

  return (
    <div className="close-button" onClick={cb} role="presentation">
      <span style={{ fontSize: '1.4em' }}>&times;</span>
    </div>
  );
}

import { useState, useEffect, useCallback } from 'react';

import { PadImpl } from '@shared/input-impl';

const { deviceService } = window;

type PropTypes = {
  deviceId: string;
  pad: PadImpl;
};

export default function Pad(props: PropTypes) {
  const { deviceId, pad } = props;

  const [mouseDown, setMouseDown] = useState(false);

  // on mousedown, send the appropriate event
  const cb = useCallback(() => {
    setMouseDown(true);
    const mm = pad.midiArray('noteon');
    deviceService.sendMsg(deviceId, mm);
  }, [pad, deviceId]);

  // on mouseup, send the appropriate event if mousedown occurred on this element
  useEffect(() => {
    if (mouseDown === true) {
      const onMouseUp = () => {
        setMouseDown(false);
        const mm = pad.midiArray('noteoff');
        deviceService.sendMsg(deviceId, mm);
      };

      window.addEventListener('mouseup', onMouseUp);
      return () => window.removeEventListener('mouseup', onMouseUp);
    }

    return () => {};
  }, [mouseDown, pad, deviceId]);

  return (
    <div
      className="pad interactive-indicator"
      role="presentation"
      onMouseDown={() => cb()}
      style={{
        borderRadius: pad.shape === 'circle' ? '100%' : 0,
      }}
    />
  );
}

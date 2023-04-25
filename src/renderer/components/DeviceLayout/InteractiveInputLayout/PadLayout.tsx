import { useEffect, useCallback } from 'react';

import { PadImpl } from '@shared/input-impl';
import { MidiArray } from '@shared/midi-array';

const { deviceService } = window;

type PropTypes = {
  deviceId: string;
  pad: PadImpl;
};

export default function Pad(props: PropTypes) {
  const { deviceId, pad } = props;

  // on mousedown, tell PadImpl that it was pressed. then, set a listener attached
  // to window so that when mouse is release, the PadImpl is "released"
  const cb = useCallback(
    (e) => {
      e.preventDefault(); // prevent drag event from firing
      pad.press();

      const onMouseUp = () => {
        pad.release();
        window.removeEventListener('mouseup', onMouseUp);
      };

      window.addEventListener('mouseup', onMouseUp);
    },
    [pad]
  );

  useEffect(() => {
    pad.onTransmit((msg: MidiArray) => deviceService.sendMsg(deviceId, msg));
  }, [pad, deviceId]);

  return (
    <div
      className="pad interactive-indicator"
      role="presentation"
      onMouseDown={cb}
      style={{
        borderRadius: pad.shape === 'circle' ? '100%' : 0,
      }}
    />
  );
}

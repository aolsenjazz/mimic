import { useCallback, MouseEvent } from 'react';

import { create } from '@shared/midi-array';

const { deviceService } = window;

type PropTypes = {
  fundamental: number;
  channel: Channel;
  octave: number;
  deviceId: string;
};

const cOrF = [0, 5];

export default function KeyWhite(props: PropTypes) {
  const { fundamental, channel, deviceId, octave } = props;
  const number = (octave * 12 + fundamental) as MidiNumber;

  // on mousedown, send note on and set a listener for mouseup
  const cb = useCallback(
    (e: MouseEvent) => {
      e.preventDefault(); // prevent drag event from firing
      // send noteon
      const noteon = create('noteon', channel, number, 127);
      deviceService.sendMsg(deviceId, noteon);

      const onMouseUp = () => {
        // send noteoff
        const noteoff = create('noteoff', channel, number, 0);
        deviceService.sendMsg(deviceId, noteoff);
        window.removeEventListener('mouseup', onMouseUp);
      };

      window.addEventListener('mouseup', onMouseUp);
    },
    [channel, number, deviceId]
  );

  return (
    <div
      className="key-white key interactive-indicator"
      onMouseDown={cb}
      role="presentation"
    >
      <div
        className={`border-${
          cOrF.includes(fundamental) ? 'full' : 'partial'
        } interactive-indicator`}
      />
    </div>
  );
}

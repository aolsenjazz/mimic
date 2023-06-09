import { useCallback, MouseEvent } from 'react';

import { create } from '@shared/midi-array';

const { deviceService } = window;

type PropTypes = {
  fundamental: number;
  octave: number;
  channel: Channel;
  deviceId: string;
};

/**
 * Graphical representation of a black key
 *
 * @param fundamental Zero-based, semitone offset from C
 */
export default function KeyBlack(props: PropTypes) {
  const { fundamental, octave, channel, deviceId } = props;
  const number = (octave * 12 + fundamental) as MidiNumber;

  // calculate distance from the left edge of parent octave
  const numKeysFromLeft = 0.5 + Math.floor(fundamental / 2);
  const adjustment = fundamental * Math.floor(fundamental / 6) * 0.9;

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
      className="key-black key interactive-indicator"
      onMouseDown={cb}
      role="presentation"
      style={{
        left: `${16.2 * numKeysFromLeft - adjustment}%`,
      }}
    />
  );
}

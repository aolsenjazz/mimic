import { useEffect, useCallback, MouseEvent } from 'react';
import styled from 'styled-components';

import { PadImpl } from '@shared/input-impl';
import { MidiArray } from '@shared/midi-array';

const { deviceService } = window;

type PropTypes = {
  deviceId: string;
  pad: PadImpl;
};

const Div = styled.div<{ animation: string }>`
  animation: ${(props) => props.animation} 500ms linear infinite;
`;

export default function Pad(props: PropTypes) {
  const { deviceId, pad } = props;

  // on mousedown, tell PadImpl that it was pressed. then, set a listener attached
  // to window so that when mouse is release, the PadImpl is "released"
  const cb = useCallback(
    (e: MouseEvent) => {
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
    <Div
      className={`pad interactive-indicator ${
        pad.color?.modifier ? pad.color?.modifier : ''
      }`}
      role="presentation"
      animation={pad.color?.modifier || ''}
      onMouseDown={cb}
      style={{
        borderRadius: pad.shape === 'circle' ? '100%' : 0,
        backgroundColor:
          pad.color !== undefined ? pad.color.string : 'transparent',
      }}
    />
  );
}

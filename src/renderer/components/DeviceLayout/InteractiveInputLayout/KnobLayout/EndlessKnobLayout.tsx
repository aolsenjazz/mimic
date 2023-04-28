import { useState, useCallback, MouseEvent as ReactMouseEvent } from 'react';

import { KnobInputImpl } from '@shared/input-impl';

const { deviceService } = window;

/**
 * Calculate radians based on point position, bound appropriately
 */
const getDeg = (
  point: { x: number; y: number },
  center: { x: number; y: number }
) => {
  const x = point.x - center.x; // dx
  const y = point.y - center.y; // dy

  let deg = (Math.atan(y / x) * 180) / Math.PI;

  // set (0, -1) to 0 radians
  if ((x < 0 && y >= 0) || (x < 0 && y < 0)) deg += 90;
  else deg += 270;

  return deg;
};

type PropTypes = {
  input: KnobInputImpl;
  deviceId: string;
};

let lastValue = -1;

export default function EndlessKnob(props: PropTypes) {
  const { input, deviceId } = props;

  const [currentDeg, setCurrentDeg] = useState(180);

  const startDrag = useCallback(
    (e: ReactMouseEvent) => {
      e.preventDefault(); // prevent ondrag from firing
      const knob = (e.target as HTMLElement).getBoundingClientRect();

      // get center of the knob
      const center = {
        x: knob.left + knob.width / 2,
        y: knob.top + knob.height / 2,
      };

      // set move handler
      const moveHandler = (innerEvent: MouseEvent) => {
        const point = {
          x: innerEvent.clientX,
          y: innerEvent.clientY,
        };

        const deg = getDeg(point, center);
        setCurrentDeg(deg);

        const newValue = Math.floor(deg);

        if (newValue !== lastValue) {
          const valToPropagate = newValue < lastValue ? 63 : 65;
          const mm = input.midiArray(valToPropagate as MidiNumber);
          deviceService.sendMsg(deviceId, mm);
          lastValue = newValue;
        }
      };
      document.addEventListener('mousemove', moveHandler);
      document.addEventListener('mouseup', () =>
        document.removeEventListener('mousemove', moveHandler)
      );
    },
    [deviceId, input]
  );

  return (
    <div className="knob endless" role="button">
      <div className="outer" onMouseDown={startDrag} role="presentation">
        <div
          className="inner interactive-indicator"
          style={{
            transform: `rotate(${currentDeg}deg)`,
            borderRadius: input.shape === 'circle' ? '100%' : '',
          }}
        />
      </div>
    </div>
  );
}

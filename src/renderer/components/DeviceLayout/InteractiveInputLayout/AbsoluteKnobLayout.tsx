import {
  useState,
  useEffect,
  useCallback,
  MouseEvent as ReactMouseEvent,
} from 'react';

import { KnobInputImpl } from '@shared/input-impl';

const { deviceService } = window;

/**
 * Scale value n from lowBound1 < n < highBound1 to lowBound2 < n highBound2
 */
const convertRange = (
  oldMin: number,
  oldMax: number,
  newMin: number,
  newMax: number,
  value: number
) => {
  return ((value - oldMin) * (newMax - newMin)) / (oldMax - oldMin) + newMin;
};

/**
 * Calculate radians based on point position, bound appropriately
 */
const getDeg = (
  point: { x: number; y: number },
  center: { x: number; y: number },
  lowerBoundAngle: number,
  upperBoundAngle: number
) => {
  const x = point.x - center.x; // dx
  const y = point.y - center.y; // dy

  let deg = (Math.atan(y / x) * 180) / Math.PI;

  // set (0, -1) to 0 radians
  if ((x < 0 && y >= 0) || (x < 0 && y < 0)) deg += 90;
  else deg += 270;

  // bound return value to startAngle < deg < upperBoundAngle, return
  return Math.min(Math.max(lowerBoundAngle, deg), upperBoundAngle);
};

type PropTypes = {
  input: KnobInputImpl;
  deviceId: string;
};

// the last value that was propagated
let lastValue = -1;

export function AbsoluteKnob(props: PropTypes) {
  const { input, deviceId } = props;

  const degrees = 270;
  const min = 0;
  const max = 127;

  const lowerAngleBound = (360 - degrees) / 2;
  const upperAngleBound = lowerAngleBound + degrees;

  const [currentDeg, setCurrentDeg] = useState(max);

  useEffect(() => {
    const value = convertRange(
      min,
      max,
      lowerAngleBound,
      upperAngleBound,
      input.value || 127
    );
    setCurrentDeg(value);
  }, [input, setCurrentDeg, lowerAngleBound, upperAngleBound]);

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

        const deg = getDeg(point, center, lowerAngleBound, upperAngleBound);
        setCurrentDeg(deg);

        const newValue = Math.floor(
          convertRange(lowerAngleBound, upperAngleBound, min, max, deg)
        );

        // don't both sending the same value twice
        if (newValue !== lastValue) {
          const mm = input.midiArray(newValue as MidiNumber);
          deviceService.sendMsg(deviceId, mm);
          lastValue = newValue;
        }
      };
      document.addEventListener('mousemove', moveHandler);
      document.addEventListener('mouseup', () =>
        document.removeEventListener('mousemove', moveHandler)
      );
    },
    [lowerAngleBound, upperAngleBound, min, max, deviceId, input]
  );

  return (
    <div className="knob" role="button">
      <div
        className="outer"
        onMouseDown={startDrag}
        role="presentation"
        style={{
          borderRadius: input.shape === 'circle' ? '100%' : '',
        }}
      >
        <div
          className="inner interactive-indicator"
          style={{ transform: `rotate(${currentDeg}deg)` }}
        >
          <div className="grip" />
        </div>
      </div>
    </div>
  );
}

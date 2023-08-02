import {
  useState,
  useEffect,
  useCallback,
  useRef,
  MouseEvent as ReactMouseEvent,
} from 'react';

import { HandleInputImpl } from '@shared/input-impl';

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
  return Math.floor(
    ((value - oldMin) * (newMax - newMin)) / (oldMax - oldMin) + newMin
  ) as MidiNumber;
};

/**
 * Calculates how much the current point has moved from the starting point, also taking into
 * account previous position via startingDelta
 */
function calcDelta(
  startingDelta: number,
  start: ReactMouseEvent,
  current: MouseEvent
) {
  return current.clientY - start.clientY + startingDelta;
}

/**
 * Bounds a number such that bound1|bound2 < delta < bound1|bound2, where one may not
 * know whether or not bound1 < bound2
 */
function boundDelta(delta: number, bound1: number, bound2: number) {
  const lb = bound1 > bound2 ? bound2 : bound1;
  const hb = lb === bound1 ? bound2 : bound1;
  return Math.max(Math.min(delta, hb), lb);
}

type PropTypes = {
  input: HandleInputImpl;
  deviceId: string;
};

// TODO: this class can be cleaned up and be more similar to XYLayout
export default function HandleLayout(props: PropTypes) {
  const { input, deviceId } = props;
  const { handleHeight, inverted, status } = input;
  const pitchbend = status === 'pitchbend';

  const [delta, setDelta] = useState(0); // handles animation, for efficiency
  const boundingBox = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!boundingBox.current) return;

    const bounds = boundingBox.current.getBoundingClientRect();
    const newMax = bounds.bottom - bounds.top;

    let pos = convertRange(0, 127, 0, newMax, input.value);
    pos = inverted ? pos : ((newMax - pos) as MidiNumber); // default is inverted

    setDelta(pos);
  }, [input, deviceId, inverted]);

  const startDrag = useCallback(
    (clickEvent: ReactMouseEvent) => {
      if (boundingBox.current === null) return; // this won't happen
      clickEvent.preventDefault(); // prevent ondrag from firing

      const bounds = boundingBox.current.getBoundingClientRect();
      let lastValue = input.value;

      const startDelta = delta;
      const hb = bounds.bottom - bounds.top;

      const moveHandler = (moveEvent: MouseEvent) => {
        // calculate how far the mouse has moved, bound to range, set
        let d = calcDelta(startDelta, clickEvent, moveEvent);
        d = boundDelta(d, 0, hb);

        setDelta(d);

        // convert to midi value, send
        let converted = convertRange(0, hb, 0, 127, d);
        converted = inverted ? converted : ((127 - converted) as MidiNumber); // inverted is default
        if (converted !== lastValue) {
          lastValue = converted;

          const mm = input.midiArray(converted);
          deviceService.sendMsg(deviceId, mm);
        }
      };

      // on mouseup: remove listeners, simulate return to position 50% if pitchbend
      const mouseUpHandler = () => {
        if (pitchbend) {
          setDelta(hb / 2); // reset UI back to center

          let x = 0; // simulate the knob returning to center
          const id = setInterval(() => {
            const val =
              lastValue - Math.floor(((lastValue - 64) * (x + 1)) / 5);

            const mm = input.midiArray(val as MidiNumber);
            deviceService.sendMsg(deviceId, mm);

            if (++x === 5) {
              window.clearInterval(id);
            }
          }, 10);
        }

        document.removeEventListener('mouseup', mouseUpHandler);
        document.removeEventListener('mousemove', moveHandler);
      };

      document.addEventListener('mousemove', moveHandler);
      document.addEventListener('mouseup', mouseUpHandler);
    },
    [delta, inverted, deviceId, input, setDelta, pitchbend]
  );

  return (
    <div className="handle-input interactive-container">
      <div
        className="bounding-box"
        ref={boundingBox}
        style={{
          left: 0, // TODO: this rule belongs in css
          justifyContent: 'top', // TODO: this rule belongs in css
          width: 'calc(100% - 2px)', // TODO: this rule belongs in css
          height: `calc(100% - ${(handleHeight / input.height) * 100}%)`,
        }}
      >
        <div
          className="inner interactive-indicator"
          onMouseDown={startDrag}
          role="presentation"
          style={{
            height: `${(handleHeight / input.height) * 100}%`,
            width: '100%', // TODO: this rule belongs in css
            marginTop: delta,
            transform: 'translateY(-50%)', // TODO: this rule belongs in css
          }}
        />
      </div>
    </div>
  );
}

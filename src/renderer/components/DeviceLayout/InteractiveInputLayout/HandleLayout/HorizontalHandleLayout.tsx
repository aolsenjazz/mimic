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
  return current.clientX - start.clientX + startingDelta;
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

export default function HandleLayout(props: PropTypes) {
  const { input, deviceId } = props;
  const { handleWidth, inverted, status } = input;
  const pitchbend = status === 'pitchbend';

  // TODO: this needs to be expressed as a percentage
  const [delta, setDelta] = useState(0); // handles animation, for efficiency
  const boundingBox = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!boundingBox.current) return;

    const bounds = boundingBox.current.getBoundingClientRect();
    const newMax = bounds.right - bounds.left;

    let pos = convertRange(0, 127, 0, newMax, input.value);
    pos = inverted ? ((newMax - pos) as MidiNumber) : pos; // invert if slider is inverted

    setDelta(pos);
  }, [input, deviceId, inverted]);

  const startDrag = useCallback(
    (clickEvent: ReactMouseEvent) => {
      if (boundingBox.current === null) return; // this won't happen
      clickEvent.preventDefault(); // prevent ondrag from firing

      const bounds = boundingBox.current.getBoundingClientRect();
      let lastValue = input.value;

      const startDelta = delta;
      const hb = bounds.right - bounds.left;

      const moveHandler = (moveEvent: MouseEvent) => {
        // calculate how far the mouse has moved, bound to range, set
        let d = calcDelta(startDelta, clickEvent, moveEvent);
        d = boundDelta(d, 0, hb);

        setDelta(d);

        // convert to midi value, send
        let converted = convertRange(0, hb, 0, 127, d);
        converted = inverted ? ((127 - converted) as MidiNumber) : converted; // invert if control is inverted
        if (converted !== lastValue) {
          lastValue = converted;

          const mm = input.midiArray(converted);
          deviceService.sendMsg(deviceId, mm);
        }
      };

      // on mouseup: remove listeners, simulate return to position 50% if pitchbend
      const mouseUpHandler = () => {
        if (pitchbend) {
          setDelta(0); // reset UI back to center

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
          top: 0,
          justifyContent: 'top',
          width: `calc(100% - ${(handleWidth / input.width) * 100}%)`,
          height: 'calc(100% - 2px)',
        }}
      >
        <div
          className="inner interactive-indicator"
          onMouseDown={startDrag}
          role="presentation"
          style={{
            height: `100%`,
            width: `${(handleWidth / input.width) * 100}%`,
            marginLeft: delta,
            transform: `translateX(-50%)`,
          }}
        />
      </div>
    </div>
  );
}

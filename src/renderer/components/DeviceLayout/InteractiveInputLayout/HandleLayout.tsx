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
 * Returns the maximum delta allowable
 *
 * This also means that though this is returning the "high bound," this number will in many
 * circumstances be higher than the "low bound."
 */
function highBound(horizontal: boolean, boundingRect: DOMRect) {
  const boundingWidth = boundingRect.right - boundingRect.left;
  const boundingHeight = boundingRect.bottom - boundingRect.top;

  return horizontal ? boundingWidth : boundingHeight;
}

/**
 * Calculates how much the current point has moved from the starting point, also taking into
 * account previous position via startingDelta
 */
function calcDelta(
  horizontal: boolean,
  startingDelta: number,
  start: ReactMouseEvent,
  current: MouseEvent
) {
  return horizontal
    ? current.clientX - start.clientX + startingDelta
    : current.clientY - start.clientY + startingDelta;
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

export function HandleLayout(props: PropTypes) {
  const { input, deviceId } = props;
  const { handleWidth, handleHeight, horizontal, status } = input;
  const pitchbend = status === 'pitchbend';
  const inverted = true;

  const [delta, setDelta] = useState(0); // handles animation, for efficiency
  const boundingBox = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!boundingBox.current) return;

    const boundRect = boundingBox.current.getBoundingClientRect();
    const newMax = highBound(input.horizontal, boundRect);

    let pos = convertRange(0, 127, 0, newMax, input.value);
    pos = horizontal ? pos : ((newMax - pos) as MidiNumber); // invert if slider is vertical
    pos = inverted ? ((newMax - pos) as MidiNumber) : pos; // invert if slider is inverted

    setDelta(pos);
  }, [input, horizontal, deviceId, inverted]);

  const startDrag = useCallback(
    (clickEvent: ReactMouseEvent) => {
      if (boundingBox.current === null) return; // this won't happen
      clickEvent.preventDefault(); // prevent ondrag from firing

      const bounds = boundingBox.current.getBoundingClientRect();
      let lastValue = input.value;

      const startDelta = delta;
      const hb = highBound(horizontal, bounds);

      const moveHandler = (moveEvent: MouseEvent) => {
        // calculate how far the mouse has moved, bound to range, set
        let d = calcDelta(horizontal, startDelta, clickEvent, moveEvent);
        d = boundDelta(d, 0, hb);

        setDelta(d);

        // convert to midi value, send
        let converted = convertRange(0, hb, 0, 127, d);
        converted = horizontal ? converted : ((127 - converted) as MidiNumber); // invert for vertical sliders
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
    [delta, horizontal, inverted, deviceId, input, setDelta, pitchbend]
  );

  return (
    <div className="wheel interactive-container">
      <div
        className="bounding-box"
        ref={boundingBox}
        style={{
          left: horizontal ? undefined : '0px',
          top: horizontal ? '0px' : undefined,
          alignItems: pitchbend ? 'center' : undefined,
          justifyContent: 'top',
          width: horizontal
            ? `calc(100% - ${(handleWidth / input.width) * 100}%)`
            : 'calc(100% - 2px)',
          height: horizontal
            ? 'calc(100% - 2px)'
            : `calc(100% - ${(handleHeight / input.height) * 100}%)`,
        }}
      >
        <div
          className="inner interactive-indicator"
          onMouseDown={startDrag}
          role="presentation"
          style={{
            height: horizontal
              ? `100%`
              : `${(handleHeight / input.height) * 100}%`,
            width: horizontal
              ? `${(handleWidth / input.width) * 100}%`
              : '100%',
            marginLeft: horizontal ? delta : undefined,
            marginTop: horizontal ? undefined : delta,
            transform: horizontal ? `translateX(-50%)` : 'translateY(-50%)',
          }}
        />
      </div>
    </div>
  );
}

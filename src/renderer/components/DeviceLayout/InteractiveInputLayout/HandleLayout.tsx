import {
  useState,
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
 * Returns the maximum delta allowable in the "decreasing" direction. Note that in this case,
 * "descreasing" refers to the user-perceived "decreasing": turning a fader down in the case of
 * a vertically-oriented fader, or left in the case of a horizontal fader.
 *
 * This also means that though this is returning the "low bound," this number will in many
 * circumstances be higher than the "high bound."
 */
function lowBound(
  horizontal: boolean,
  inverted: boolean,
  startingDelta: number,
  gripRect: DOMRect,
  boundingRect: DOMRect
) {
  if (horizontal) {
    return inverted
      ? boundingRect.right - gripRect.right + startingDelta // this should be n >= 0
      : boundingRect.left - gripRect.left + startingDelta; // this should be n <= 0
  }

  return inverted
    ? boundingRect.top - gripRect.top + startingDelta // this should be n <= 0
    : boundingRect.bottom - gripRect.bottom + startingDelta; // this should be n >= 0
}

/**
 * Returns the maximum delta allowable in the "increasing" direction. Note that in this case,
 * "increasing" refers to the user-perceived "increasing": turning a fader up in the case of
 * a vertically-oriented fader, or left in the case of a horizontal fader.
 *
 * This also means that though this is returning the "high bound," this number will in many
 * circumstances be higher than the "low bound."
 */
function highBound(
  horizontal: boolean,
  inverted: boolean,
  startingDelta: number,
  gripRect: DOMRect,
  boundingRect: DOMRect
) {
  if (horizontal) {
    return inverted
      ? boundingRect.left - gripRect.left + startingDelta
      : boundingRect.right - gripRect.right + startingDelta; // this should be n >= 0
  }

  return inverted
    ? boundingRect.bottom - gripRect.bottom + startingDelta
    : boundingRect.top - gripRect.top + startingDelta;
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

/**
 * Depending on characterics of the input, returns the CSS styles to correctly
 * set the starting position of the grip
 */
function createInitialPosition(
  horizontal: boolean,
  inverted: boolean,
  pitchbend: boolean
) {
  if (pitchbend) {
    return {};
  }

  return {
    top: inverted ? undefined : 0,
    bottom: inverted ? 0 : undefined,
    left: horizontal && inverted ? 0 : undefined,
    right: horizontal && !inverted ? 0 : undefined,
  };
}

type PropTypes = {
  input: HandleInputImpl;
  deviceId: string;
};

export function HandleLayout(props: PropTypes) {
  const { input, deviceId } = props;
  const { handleWidth, horizontal, inverted, status } = input;
  const pitchbend = status === 'pitchbend';

  const [delta, setDelta] = useState(0); // handles animation, for efficiency
  const boundingBox = useRef<HTMLDivElement>(null);

  const startDrag = useCallback(
    (clickEvent: ReactMouseEvent) => {
      if (boundingBox.current === null) return; // this won't happen
      clickEvent.preventDefault(); // prevent ondrag from firing

      // find the bounds of the grip and its bounding box
      const grip = (clickEvent.target as HTMLElement).getBoundingClientRect();
      const bounds = boundingBox.current.getBoundingClientRect();
      let lastValue = -1;

      // Save the starting delta, calculate how far grip is allowed to move in
      // both directions
      const startDelta = delta;
      const lb = lowBound(horizontal, inverted, startDelta, grip, bounds);
      const hb = highBound(horizontal, inverted, startDelta, grip, bounds);

      const moveHandler = (moveEvent: MouseEvent) => {
        // calculate how far the mouse has moved, bound to range, set
        let d = calcDelta(horizontal, startDelta, clickEvent, moveEvent);
        d = boundDelta(d, lb, hb);
        setDelta(d);

        // convert to midi value, send
        const converted = convertRange(lb, hb, 0, 127, d);
        if (converted !== lastValue) {
          lastValue = converted;

          const mm = input.midiArray(converted);
          deviceService.sendMsg(deviceId, mm);
        }

        // TODO: send a message, invert the value if horizontal
      };

      document.addEventListener('mousemove', moveHandler);
      document.addEventListener('mouseup', () => {
        document.removeEventListener('mousemove', moveHandler);
      });
    },
    [delta, horizontal, inverted, deviceId, input]
  );

  return (
    <div className="wheel interactive-container">
      <div
        className="bounding-box"
        ref={boundingBox}
        style={{
          alignItems: pitchbend ? 'center' : undefined,
          justifyContent: pitchbend ? 'center' : undefined,
        }}
      >
        <div
          className="inner interactive-indicator"
          onMouseDown={startDrag}
          role="presentation"
          style={{
            ...createInitialPosition(horizontal, inverted, pitchbend),
            transform: `translate(${horizontal ? delta : 0}px, ${
              horizontal ? 0 : delta
            }px)`,
            width: `calc(${(handleWidth / input.width) * 100}% - 2px)`,
            height: `calc(${(handleWidth / input.height) * 100}% - 2px)`,
          }}
        />
      </div>
    </div>
  );
}

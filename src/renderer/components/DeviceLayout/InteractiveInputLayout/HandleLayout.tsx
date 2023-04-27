import {
  useState,
  useCallback,
  useRef,
  MouseEvent as ReactMouseEvent,
} from 'react';

import { HandleInputImpl } from '@shared/input-impl';

type PropTypes = {
  input: HandleInputImpl;
};

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

export function HandleLayout(props: PropTypes) {
  const { input } = props;
  const { handleWidth } = input;

  const computedHandleWidth = `${(handleWidth / input.width) * 100}%`;
  const computedHandleHeight = `${(handleWidth / input.height) * 100}%`;
  const hori = input.horizontal; // pretty whack, but no current better way

  const [delta, setDelta] = useState(0); // handles animation, for efficiency
  const boundingBox = useRef<HTMLDivElement>(null);

  const startDrag = useCallback(
    (e: ReactMouseEvent) => {
      if (boundingBox.current === null) return;

      e.preventDefault(); // prevent ondrag from firing
      const grip = (e.target as HTMLElement).getBoundingClientRect();
      const boundingRect = boundingBox.current.getBoundingClientRect();
      const dragStartPos = {
        x: e.clientX,
        y: e.clientY,
      };

      const startingDelta = delta;

      const lowBoundDelta = hori
        ? startingDelta - boundingRect.left + grip.left
        : startingDelta + boundingRect.top - grip.top;

      const highBoundDelta = hori
        ? -startingDelta + boundingRect.right - grip.right
        : startingDelta + boundingRect.bottom - grip.bottom;

      const moveHandler = (innerEvent: MouseEvent) => {
        const point = {
          x: innerEvent.clientX,
          y: innerEvent.clientY,
        };

        let dy = hori
          ? startingDelta - point.x + dragStartPos.x
          : startingDelta + point.y - dragStartPos.y; // calculate dy

        // SAVE THIS ~~~~~~~~~~~~~~~~~~~~~
        dy = hori
          ? Math.max(Math.min(dy, lowBoundDelta), highBoundDelta)
          : Math.max(Math.min(dy, highBoundDelta), lowBoundDelta); // bounded dy

        setDelta(dy);

        const converted = convertRange(
          highBoundDelta,
          lowBoundDelta,
          0,
          127,
          dy
        );

        // TODO: send a message, invert the value if horizontal
      };

      document.addEventListener('mousemove', moveHandler);
      document.addEventListener('mouseup', () => {
        document.removeEventListener('mousemove', moveHandler);
      });
    },
    [delta, hori]
  );

  return (
    <div className="wheel interactive-container">
      <div
        className="bounding-box"
        ref={boundingBox}
        style={{
          height: `100%`,
        }}
      >
        <div
          className="inner interactive-indicator"
          onMouseDown={startDrag}
          role="presentation"
          style={{
            transform: `translateY(${delta}px)`,
            width: `calc(${computedHandleWidth} - 2px)`,
            height: `calc(${computedHandleHeight})`,
          }}
        />
      </div>
    </div>
  );
}

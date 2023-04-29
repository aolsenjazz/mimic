import {
  useState,
  useCallback,
  useRef,
  MouseEvent as ReactMouseEvent,
} from 'react';

import { XYImpl } from '@shared/input-impl';

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
  );
};

function bound(val: number, lowBound: number, highBound: number) {
  return Math.max(Math.min(val, highBound), lowBound);
}

function calcPosition(moveEvent: MouseEvent, bounds: DOMRect) {
  return {
    xp: bound(
      convertRange(bounds.left, bounds.right, 0, 100, moveEvent.clientX),
      0,
      100
    ),
    yp: bound(
      convertRange(bounds.top, bounds.bottom, 0, 100, moveEvent.clientY),
      0,
      100
    ),
  };
}

function toBase50(n: number) {
  return n - 50 * Math.floor(n / 50);
}

function xPositionToValue(n: number) {
  return Math.floor((n / 100) * 127) as MidiNumber;
}

function yPositionToValue(n: number) {
  const base50 = toBase50(n < 50 ? 100 - n : n);
  return Math.floor(
    [0, 100].includes(n) ? 127 : (((base50 / 50) * 127) as MidiNumber)
  );
}

type PropTypes = {
  deviceId: string;
  input: XYImpl;
};

export default function XYLayout(props: PropTypes) {
  const { deviceId, input } = props;
  const { x, y, shape } = input;
  const { handleWidth, handleHeight } = x;

  // compute handle size w.r.t. inputs size (this is not final!)
  let handleWidthPercent = (handleWidth / input.width) * 100;
  let handleHeightPercent = (handleHeight / input.height) * 100;

  const boundingBoxWidth = 100 - handleWidthPercent;
  const boundingBoxHeight = 100 - handleHeightPercent;

  // handle size is relative to bounding box, so compensate
  handleWidthPercent += boundingBoxWidth / input.width;
  handleHeightPercent += boundingBoxHeight / input.height;

  const boundingBox = useRef<HTMLDivElement>(null);
  const [xPos, setXPos] = useState(50);
  const [yPos, setYPos] = useState(50);

  const startDrag = useCallback(
    (clickEvent: ReactMouseEvent) => {
      if (boundingBox.current === null) return; // this won't happen
      clickEvent.preventDefault(); // prevent ondrag from firing

      const inputs = [x, y];
      const bounds = boundingBox.current.getBoundingClientRect();
      const lastVals = [x.value, y.value];

      const moveHandler = (moveEvent: MouseEvent) => {
        const { xp, yp } = calcPosition(moveEvent, bounds);

        setXPos(xp);
        setYPos(yp);

        const vals = [xPositionToValue(xp), yPositionToValue(yp)];
        vals
          .map((v, i) => (inputs[i].inverted ? 127 - v : v))
          .forEach((v, i) => {
            if (lastVals[i] !== v) {
              lastVals[i] = v as MidiNumber;
              const ma = inputs[i].midiArray(v as MidiNumber);
              deviceService.sendMsg(deviceId, ma);
            }
          });
      };

      // on mouseup: remove listeners, simulate return to position 50%
      const mouseUpHandler = () => {
        setXPos(50);
        setYPos(50);

        let step = 0; // simulate joystick returning
        const id = setInterval(() => {
          const xVal =
            lastVals[0] - Math.floor(((lastVals[0] - 64) * (step + 1)) / 5);
          const yVal = lastVals[1] - Math.floor((lastVals[1] * (step + 1)) / 5);
          [xVal, yVal]
            .map((v, i) => inputs[i].midiArray(v as MidiNumber))
            .forEach((mm) => deviceService.sendMsg(deviceId, mm));

          if (++step === 5) {
            window.clearInterval(id);
          }
        }, 10);

        document.removeEventListener('mouseup', mouseUpHandler);
        document.removeEventListener('mousemove', moveHandler);
      };

      document.addEventListener('mousemove', moveHandler);
      document.addEventListener('mouseup', mouseUpHandler);
    },
    [deviceId, x, y]
  );

  return (
    <div
      className="xy interactive-container"
      style={{
        borderRadius: shape === 'circle' ? '100%' : '',
      }}
      role="button"
    >
      <div
        className="bounding-box"
        ref={boundingBox}
        style={{
          width: `${boundingBoxWidth}%`,
          height: `${boundingBoxHeight}%`,
        }}
      >
        <div
          className="inner interactive-indicator"
          onMouseDown={startDrag}
          role="presentation"
          style={{
            width: `${handleWidthPercent}%`,
            height: `${handleHeightPercent}%`,
            marginLeft: `${xPos}%`,
            marginTop: `${yPos}%`,
          }}
        />
      </div>
    </div>
  );
}

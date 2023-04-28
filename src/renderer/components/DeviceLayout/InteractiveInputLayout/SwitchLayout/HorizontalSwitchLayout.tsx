import {
  useState,
  useEffect,
  useCallback,
  useRef,
  MouseEvent as ReactMouseEvent,
} from 'react';

import { SwitchImpl } from '@shared/input-impl';

const { deviceService } = window;

type PropTypes = {
  input: SwitchImpl;
  deviceId: string;
};

export default function HandleLayout(props: PropTypes) {
  const { input, deviceId } = props;
  const { steps } = input;

  const nSteps = steps.length;
  const stepIdx = 0;

  const position = stepIdx / nSteps;
  const iStyle = {
    bottom: `calc(${position * 100}% - 1px)`,
    left: -1,
    width: `100%`,
    height: `${(1 / nSteps) * 100}%`,
  };

  const boundingBox = useRef<HTMLDivElement>(null);

  const startDrag = useCallback((clickEvent: ReactMouseEvent) => {
    if (boundingBox.current === null) return; // this won't happen
    clickEvent.preventDefault(); // prevent ondrag from firing

    const grip = clickEvent.target as HTMLElement;
    const bounds = boundingBox.current.getBoundingClientRect();

    const stepThresholds = Array(nSteps).map(
      (_v, i) => bounds.top + i * grip.offsetHeight
    );
    console.log(stepThresholds);

    const moveHandler = (moveEvent: MouseEvent) => {
      const y = moveEvent.clientY;
    };

    const mouseUpHandler = () => {
      document.removeEventListener('mouseup', mouseUpHandler);
      document.removeEventListener('mousemove', moveHandler);
    };

    document.addEventListener('mousemove', moveHandler);
    document.addEventListener('mouseup', mouseUpHandler);
  }, []);

  return (
    <div
      className="switch interactive-indicator"
      ref={boundingBox}
      onMouseDown={startDrag}
    >
      <div className="inner interactive-indicator" style={iStyle} />
    </div>
  );
}

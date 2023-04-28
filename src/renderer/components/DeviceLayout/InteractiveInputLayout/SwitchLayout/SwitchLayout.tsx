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

export default function SwitchLayout(props: PropTypes) {
  const { input, deviceId } = props;
  const { inverted } = input;

  const [step, setStep] = useState(input.currentStep);
  const boundingBox = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setStep(input.currentStep);
  }, [input, deviceId]);

  const startDrag = useCallback(
    (clickEvent: ReactMouseEvent) => {
      if (boundingBox.current === null) return; // this won't happen
      clickEvent.preventDefault(); // prevent ondrag from firing

      const grip = clickEvent.target as HTMLElement;
      const bounds = boundingBox.current.getBoundingClientRect();

      const stepThresholds = [...Array(input.steps.length)].map(
        (_v, i) => bounds.top + i * grip.offsetHeight
      );

      const moveHandler = (moveEvent: MouseEvent) => {
        const y = moveEvent.clientY;

        let { currentStep } = input;
        stepThresholds.forEach((s) => {
          if (y > s) currentStep = stepThresholds.indexOf(s);
        });

        const maybeInverted = inverted
          ? input.steps.length - currentStep - 1
          : currentStep;

        if (maybeInverted !== input.currentStep) {
          setStep(currentStep);

          const ma = input.midiArray(maybeInverted);
          deviceService.sendMsg(deviceId, ma);
        }
      };

      const mouseUpHandler = () => {
        document.removeEventListener('mouseup', mouseUpHandler);
        document.removeEventListener('mousemove', moveHandler);
      };

      document.addEventListener('mousemove', moveHandler);
      document.addEventListener('mouseup', mouseUpHandler);
    },
    [input, deviceId, inverted]
  );

  return (
    <div
      className="switch interactive-indicator"
      ref={boundingBox}
      role="presentation"
      onMouseDown={startDrag}
    >
      <div
        className="inner interactive-indicator"
        style={{
          top: `calc(${(step / input.steps.length) * 100}% - 1px)`,
          left: -1,
          width: `100%`,
          height: `${(1 / input.steps.length) * 100}%`,
        }}
      />
    </div>
  );
}

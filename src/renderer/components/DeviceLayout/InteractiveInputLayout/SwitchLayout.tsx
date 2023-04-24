import { SwitchImpl } from '@shared/input-impl';

type PropTypes = {
  input: SwitchImpl;
};

export function SwitchLayout(props: PropTypes) {
  const { input } = props;
  const { steps, style } = input;

  const nSteps = steps.length;
  const stepIdx = 0;

  const position = stepIdx / nSteps;
  const iStyle = {
    bottom: `calc(${position * 100}% - 1px)`,
    left: -1,
    width: `100%`,
    height: `${(1 / nSteps) * 100}%`,
  };

  return (
    <div className="switch interactive-indicator" style={style}>
      <div className="inner interactive-indicator" style={iStyle} />
    </div>
  );
}

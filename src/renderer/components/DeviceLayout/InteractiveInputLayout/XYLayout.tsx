import { XYImpl } from '@shared/input-impl';

type PropTypes = {
  deviceId: string;
  input: XYImpl;
};

export default function XYLayout(props: PropTypes) {
  const { deviceId, input } = props;
  const { x, y, width, height, shape } = input;
  const { handleWidth, handleHeight } = x;

  const xShift = 0;
  const yShift = 0;
  const isXPitchbend = false;
  const isYPitchbend = false;

  const iStyle = {
    width: `${width}`,
    height: `${height}`,
    marginLeft: -1,
    marginTop: -1,
  };

  const xStyle = isXPitchbend
    ? `calc(${xShift} * 50%)`
    : `calc(25% + 25% * ${xShift})`;

  const yStyle = isYPitchbend
    ? `calc(50% + 25% * ${yShift})`
    : `calc(50% + 25% * ${yShift})`;

  return (
    <div
      className="interactive-indicator"
      tabIndex={0}
      onKeyDown={() => {}}
      style={{
        borderRadius: shape === 'circle' ? '100%' : '',
        height,
        width,
      }}
      role="button"
    >
      <div
        style={{
          top: yStyle,
          left: xStyle,
          position: 'absolute',
          width: handleWidth,
          height: handleHeight,
          transform: `translate(0, -50%)`,
        }}
      >
        <div className="inner interactive-indicator" style={iStyle} />
      </div>
    </div>
  );
}

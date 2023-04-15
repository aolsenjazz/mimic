type PropTypes = {
  isXPitchbend: boolean;
  isYPitchbend: boolean;
  xMax: number;
  yMax: number;
  xValue: number;
  yValue: number;
  width: string;
  height: string;
  handleWidth: string;
  handleHeight: string;
  shape: string;
};

export default function XYLayout(props: PropTypes) {
  const {
    width,
    isXPitchbend,
    isYPitchbend,
    xMax,
    yMax,
    height,
    xValue,
    yValue,
    shape,
    handleWidth,
    handleHeight,
  } = props;

  const xShift = xValue / xMax;
  const yShift = yValue / yMax;

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

import { HandleInputImpl } from '@shared/input-impl';

type PropTypes = {
  input: HandleInputImpl;
};

export function HandleLayout(props: PropTypes) {
  const { input } = props;
  const { style, handleWidth, handleHeight } = input;
  const value = 0;

  const max = 127;
  const boundingStyle = {
    bottom: `calc(${handleHeight} / 2)`,
    height: `calc(100% - ${handleHeight})`,
  };

  const shift = value / max;
  const iStyle = {
    bottom: `${shift * 100}%`,
    left: 0,
    width: `calc(${handleWidth / input.width} - 2px)`,
    height: `calc(${handleHeight / input.height} + ${
      handleHeight / input.height
    } / 2 - 2px)`,
  };

  return (
    <div className="wheel interactive-indicator" style={style}>
      <div className="bounding-box" style={boundingStyle}>
        <div className="inner interactive-indicator" style={iStyle} />
      </div>
    </div>
  );
}

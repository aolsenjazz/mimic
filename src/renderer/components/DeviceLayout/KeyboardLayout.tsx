/* eslint-disable react/no-array-index-key */
import KeyBlack from './KeyBlack';
import KeyWhite from './KeyWhite';

const FUNDAMENTALS_WHITE = [0, 2, 4, 5, 7, 9, 11];
const FUNDAMENTALS_BLACK = [1, 3, 6, 8, 10];

type PropTypes = {
  nOctaves: number;
  width: number;
  height: number;
  left: number;
  bottom: number;
  deviceWidth: number;
  deviceHeight: number;
  channel: Channel;
  deviceId: string;
  defaultOctave: number;
  enabled: boolean;
};

export default function Keyboard(props: PropTypes) {
  const {
    nOctaves,
    width,
    height,
    left,
    bottom,
    deviceWidth,
    deviceHeight,
    channel,
    deviceId,
    defaultOctave,
    enabled,
  } = props;

  const style = {
    width: `${(width / deviceWidth) * 100}%`,
    height: `${(height / deviceHeight) * 100}%`,
    left: `${(left / deviceWidth) * 100}%`,
    bottom: `${(bottom / deviceHeight) * 100}%`,
  };

  return (
    <div
      style={style}
      className={`keyboard-container input-grid ${enabled ? '' : 'disabled'}`}
    >
      {[...Array(nOctaves)].map((_x, octave) => (
        <div
          key={octave}
          className="octave"
          style={{
            width: `calc(${100 / nOctaves}% - ${
              100 / nOctaves / 7 / nOctaves
            }%)`,
          }}
        >
          {FUNDAMENTALS_WHITE.map((fundamental) => (
            <KeyWhite
              fundamental={fundamental}
              key={fundamental * octave + fundamental}
              octave={octave + defaultOctave}
              channel={channel}
              deviceId={deviceId}
            />
          ))}

          {FUNDAMENTALS_BLACK.map((fundamental) => (
            <KeyBlack
              key={fundamental * octave + fundamental}
              fundamental={fundamental}
              octave={octave + defaultOctave}
              channel={channel}
              deviceId={deviceId}
            />
          ))}
        </div>
      ))}
      <KeyWhite
        fundamental={0}
        key={0}
        octave={nOctaves + defaultOctave}
        channel={channel}
        deviceId={deviceId}
      />
    </div>
  );
}

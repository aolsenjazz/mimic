import { InputGridImpl } from '@shared/input-grid-impl';
import { BaseInputImpl, InteractiveInputImpl } from '@shared/input-impl';

import InteractiveInputLayout from './InteractiveInputLayout';
import NoninteractiveInputLayout from './NoninteractiveInputLayout';

type InputLayoutPropTypes = {
  deviceId: string;
  input: BaseInputImpl;
  width: string;
  height: string;
};

function InputLayout(props: InputLayoutPropTypes) {
  const { deviceId, input, width, height } = props;

  let Element;
  if (input instanceof InteractiveInputImpl) {
    Element = (
      <div
        className="input-wrapper"
        role="presentation"
        style={{
          width,
          height,
        }}
      >
        <InteractiveInputLayout deviceId={deviceId} input={input} />
      </div>
    );
  } else {
    Element = (
      <div
        className="input-wrapper"
        style={{
          width,
          height,
        }}
      >
        <NoninteractiveInputLayout shape={input.shape} />
      </div>
    );
  }

  return Element;
}

type PropTypes = {
  deviceId: string;
  grid: InputGridImpl;
  deviceWidth: number;
  deviceHeight: number;
};

export default function InputGridLayout(props: PropTypes) {
  const { deviceId, grid, deviceHeight, deviceWidth } = props;

  const style = {
    width: `${(grid.width / deviceWidth) * 100}%`,
    height: `${(grid.height / deviceHeight) * 100}%`,
    left: `${(grid.left / deviceWidth) * 100}%`,
    bottom: `${(grid.bottom / deviceHeight) * 100}%`,
  };

  return (
    <div className="input-grid" style={style}>
      {grid.inputImpls.map((input, i) => (
        <div
          className="input-container"
          // eslint-disable-next-line react/no-array-index-key
          key={`InputGrid[${i}]`}
          style={{
            width: `calc(100% / ${grid.nCols})`,
            height: `calc(100% / ${grid.nRows})`,
          }}
        >
          <InputLayout
            deviceId={deviceId}
            input={input}
            width={`${(input.width / (grid.width / grid.nCols)) * 100}%`}
            height={`${(input.height / (grid.height / grid.nRows)) * 100}%`}
          />
        </div>
      ))}
    </div>
  );
}

import {
  InputGridDriver,
  InputDriver,
  InteractiveInputDriver,
} from '@shared/driver-types';

import InteractiveInputLayout from './InteractiveInputLayout';
import NoninteractiveInputLayout from './NoninteractiveInputLayout';

type InputLayoutPropTypes = {
  driver: InputDriver;
  width: string;
  height: string;
};

function InputLayout(props: InputLayoutPropTypes) {
  const { driver, width, height } = props;

  let Element;
  if (driver.interactive) {
    Element = (
      <div
        className="input-wrapper"
        role="presentation"
        style={{
          width,
          height,
        }}
      >
        <InteractiveInputLayout driver={driver as InteractiveInputDriver} />
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
        <NoninteractiveInputLayout shape={driver.shape} />
      </div>
    );
  }

  return Element;
}

type PropTypes = {
  inputGrid: InputGridDriver;
  deviceWidth: number;
  deviceHeight: number;
};

const InputGridLayout = (props: PropTypes) => {
  const { inputGrid, deviceHeight, deviceWidth } = props;

  const style = {
    width: `${(inputGrid.width / deviceWidth) * 100}%`,
    height: `${(inputGrid.height / deviceHeight) * 100}%`,
    left: `${(inputGrid.left / deviceWidth) * 100}%`,
    bottom: `${(inputGrid.bottom / deviceHeight) * 100}%`,
  };

  return (
    <div className="input-grid" style={style}>
      {inputGrid.inputs.map((driver, i) => (
        <div
          className="input-container"
          // eslint-disable-next-line react/no-array-index-key
          key={`InputGrid[${i}]`}
          style={{
            width: `calc(100% / ${inputGrid.nCols})`,
            height: `calc(100% / ${inputGrid.nRows})`,
          }}
        >
          <InputLayout
            driver={driver}
            width={`${
              (driver.width / (inputGrid.width / inputGrid.nCols)) * 100
            }%`}
            height={`${
              (driver.height / (inputGrid.height / inputGrid.nRows)) * 100
            }%`}
          />
        </div>
      ))}
    </div>
  );
};

export default InputGridLayout;

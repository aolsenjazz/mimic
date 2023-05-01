import DragBoundary from '../DragBoundary';

type PropTypes = {
  value: string;
  width: string;
  showResizer: boolean;
  onDrag: (dx: number) => void;
};

export default function TH(props: PropTypes) {
  const { value, width, showResizer, onDrag } = props;

  return (
    <th style={{ width }}>
      {value}
      {showResizer === true ? (
        <DragBoundary
          horizontal={false}
          width={6}
          height="100%"
          onDrag={onDrag}
        />
      ) : null}
    </th>
  );
}

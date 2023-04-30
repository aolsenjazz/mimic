type PropTypes = {
  width: number | string;
  height: number | string;
  horizontal: boolean;
};

export default function DragBoundary(props: PropTypes) {
  const { width, height, horizontal } = props;

  return (
    <div
      className="drag-boundary"
      style={{
        width,
        height,
      }}
    >
      <div
        className="marker"
        style={{
          width: horizontal ? '100%' : '1px',
          height: horizontal ? '1px' : '100%',
        }}
      />
    </div>
  );
}

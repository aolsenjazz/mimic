import { useCallback, MouseEvent as ReactMouseEvent } from 'react';

type PropTypes = {
  width: number | string;
  height: number | string;
  horizontal: boolean;
  onDrag: (dx: number) => void;
};

export default function DragBoundary(props: PropTypes) {
  const { width, height, horizontal, onDrag } = props;

  const startDrag = useCallback(
    (clickEvent: ReactMouseEvent) => {
      clickEvent.preventDefault(); // prevent ondrag from firing
      let lastX = clickEvent.clientX;

      const moveHandler = (moveEvent: MouseEvent) => {
        onDrag(moveEvent.clientX - lastX);
        lastX = moveEvent.clientX;
      };

      // on mouseup: remove listeners
      const mouseUpHandler = () => {
        document.removeEventListener('mouseup', mouseUpHandler);
        document.removeEventListener('mousemove', moveHandler);
      };

      document.addEventListener('mousemove', moveHandler);
      document.addEventListener('mouseup', mouseUpHandler);
    },
    [onDrag]
  );

  return (
    <div
      className="drag-boundary"
      role="presentation"
      onMouseDown={startDrag}
      style={{
        width,
        height,
        cursor: horizontal ? 'ns-resize' : 'ew-resize',
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

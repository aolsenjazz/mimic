import {
  useState,
  useCallback,
  useEffect,
  MouseEvent as ReactMouseEvent,
} from 'react';

type Point = {
  x: number;
  y: number;
};

type PropTypes = {
  width: number | string;
  height: number | string;
  horizontal: boolean;
  onDrag: (dx: number, dy: number) => void;
};

export default function DragBoundary(props: PropTypes) {
  const { width, height, horizontal, onDrag } = props;

  const [listen, setListen] = useState(false);
  const [pos, setPos] = useState<Point>({ x: -1, y: -1 });

  useEffect(() => {
    const cb = (moveEvent: MouseEvent) => {
      if (listen) {
        onDrag(moveEvent.clientX - pos.x, moveEvent.clientY - pos.y);

        setPos({
          x: moveEvent.clientX,
          y: moveEvent.clientY,
        });
      }
    };

    document.addEventListener('mousemove', cb);
    return () => document.removeEventListener('mousemove', cb);
  }, [onDrag, pos, listen]);

  const startDrag = useCallback(
    (clickEvent: ReactMouseEvent) => {
      clickEvent.preventDefault(); // prevent ondrag from firing

      setPos({
        x: clickEvent.clientX,
        y: clickEvent.clientY,
      });

      // on mouseup: remove listeners
      const mouseUpHandler = () => {
        setListen(false);
        document.removeEventListener('mouseup', mouseUpHandler);
      };

      setListen(true);
      document.addEventListener('mouseup', mouseUpHandler);
    },
    [setListen]
  );

  return (
    <div
      className="drag-boundary"
      role="presentation"
      onMouseDown={startDrag}
      // onClick={cb}
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

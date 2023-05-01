import { useState, useCallback, useRef } from 'react';

import TH from './TH';

export type Column = {
  title: string;
  accessor: string;
};

type PropTypes = {
  columns: Column[];
  rows: any[];
};

function bound(n: number, basePercent: number) {
  return Math.max(Math.min(n, basePercent * 1.9), basePercent * 0.1);
}

export function ResizeableTable(props: PropTypes) {
  const { columns, rows } = props;
  const nCols = columns.length;
  const basePercent = 100 / nCols;

  const row = useRef<HTMLTableRowElement | null>(null);
  const [widths, setWidths] = useState<number[]>(
    Array(nCols).fill(100 / nCols)
  );

  const handleResize = useCallback(
    (index: number, dx: number) => {
      if (row === null) return;

      const rowRect = row.current?.getBoundingClientRect()!;
      const rowWidth = rowRect.right - rowRect.left;
      const dxPercent = (dx / rowWidth) * 100;

      // modify column width
      let newWidth = widths[index] + dxPercent;
      newWidth = bound(newWidth, basePercent);
      widths[index] = newWidth;

      // modify adjacent column width
      let newWidth2 = widths[index + 1] - dxPercent;
      newWidth2 = bound(newWidth2, basePercent);
      widths[index + 1] = newWidth2;

      const remainingWidth =
        widths.reduce((last, current) => last + current) - 100;
      const nOtherCols = nCols - 2;
      // modify the remaining columns widths
      const otherCols = [...Array(nCols).keys()].filter(
        (k) => ![index, index + 1].includes(k)
      );
      otherCols.forEach((i) => {
        widths[i] -= remainingWidth / nOtherCols;
      });

      setWidths([...widths]);
    },
    [nCols, widths, basePercent]
  );

  return (
    <table>
      <thead>
        <tr ref={row}>
          {columns.map((c, i) => (
            <TH
              key={c.title}
              width={`${widths[i]}%`}
              value={c.title}
              showResizer={i < nCols - 1}
              onDrag={(dx: number) => handleResize(i, dx)}
            />
          ))}
        </tr>
      </thead>
      <tbody>
        {rows.map((r) => {
          return (
            <tr key={`${JSON.stringify(r)}`}>
              {columns.map((c) => {
                return <td>{r[c.accessor]}</td>;
              })}
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}

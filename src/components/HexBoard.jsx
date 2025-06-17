import React, { useMemo } from 'react';
import HexTile from './HexTile';
import { makeInitialTiles } from '../data/initialTiles';

export default function HexBoard({ rows = 10, cols = 10 }) {
  // 1) create our tile data
  const tiles = useMemo(() => makeInitialTiles(rows, cols), [rows, cols]);

  // 2) sizing math
  const hexSize = 60;                                 // px
  const hexHeight = Math.sqrt(3) / 2 * hexSize;      // ≈ 52px
  const boardWidth  = hexSize + (cols - 1) * hexSize * 0.75;
  const boardHeight = hexHeight * rows + hexHeight / 2;

  return (
    <div
      className="board"
      style={{
        position: 'relative',
        width:  `${boardWidth}px`,
        height: `${boardHeight}px`,
        margin: '2rem auto',
      }}
    >
      {tiles.flat().map(tile => {
        const { row, col } = tile;
        // flat-top hex layout:
        const x = col * hexSize * 0.75;
        const y = row * hexHeight + (col % 2) * (hexHeight / 2);

        return (
          <HexTile
            key={`${row}-${col}`}
            tile={tile}
            x={x}
            y={y}
            hexSize={hexSize}
            hexHeight={hexHeight}
          />
        );
      })}
    </div>
  );
}

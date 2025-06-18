// src/components/HexBoard.jsx
import React from 'react';
import HexTile from './HexTile';

export default function HexBoard({
  tiles,
  units,
  settlements,
  onTileClick,
  rows = 10,
  cols = 10,
  highlightTiles = [],
}) {
  const flatTiles = Array.isArray(tiles[0]) ? tiles.flat() : tiles;

  const size = 30;
  const hexWidth = size * 2;
  const hexHeight = (Math.sqrt(3) / 2) * hexWidth;
  const boardWidth = hexWidth + (cols - 1) * size * 1.5;
  const boardHeight = hexHeight * rows + hexHeight / 2;

  const isHighlighted = (r, c) =>
    highlightTiles.some((t) => t.row === r && t.col === c);

  return (
    <svg width={boardWidth} height={boardHeight} style={{ userSelect: 'none' }}>
      {flatTiles.map((tile) => (
        <g key={`${tile.row},${tile.col}`}
           opacity={isHighlighted(tile.row, tile.col) ? 0.6 : 1}
        >
          <HexTile
            tile={tile}
            units={units}
            settlements={settlements}
            onTileClick={onTileClick}
          />
        </g>
      ))}
    </svg>
  );
}

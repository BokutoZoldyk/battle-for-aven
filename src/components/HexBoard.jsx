// src/components/HexBoard.jsx
import React from 'react';
import HexTile from './HexTile';

export default function HexBoard({ tiles, units, settlements, onTileClick }) {
  return (
    <svg width="600" height="600">
      {tiles.map(tile => (
        <HexTile
          key={`${tile.row},${tile.col}`}
          tile={tile}
          units={units}
          settlements={settlements}
          onTileClick={onTileClick}
        />
      ))}
    </svg>
  );
}

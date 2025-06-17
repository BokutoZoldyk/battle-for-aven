import React from 'react';

export default function HexTile({ tile, x, y, hexSize, hexHeight }) {
  return (
    <div
      className={`hexagon ${tile.terrain}`}
      style={{
        position: 'absolute',
        left:   `${x}px`,
        top:    `${y}px`,
        width:  `${hexSize}px`,
        height: `${hexHeight}px`,
      }}
      title={`(${tile.row},${tile.col})`}
    >
      {tile.unit && (
        <div className="unit-placeholder">
          {tile.unit.type}
        </div>
      )}
    </div>
  );
}

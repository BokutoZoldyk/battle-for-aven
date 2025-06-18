// src/components/HexUnit.jsx
import React from 'react';

/** 
 * Renders a small colored circle or icon for a unit on a given hex.
 * Props:
 *  - unit: { id, faction, type, tile: {row, col} }
 *  - size: pixel diameter
 */
export default function HexUnit({ unit, size = 16, center = { x: 30, y: 30 }, modelSelections = {} }) {
  const colors = {
    Player1: 'blue',
    Player2: 'red',
    Player3: 'green',
    Player4: 'purple',
  };
  const color = colors[unit.faction] || 'black';

  const imgSrc = modelSelections?.units?.[unit.type];

  if (imgSrc) {
    const x = center.x - size / 2;
    const y = center.y - size / 2;
    return (
      <image
        href={imgSrc}
        x={x}
        y={y}
        width={size}
        height={size}
      />
    );
  }

  return (
    <circle
      cx={center.x}
      cy={center.y}
      r={size / 2}
      fill={color}
      stroke="white"
      strokeWidth="2"
    />
  );
}

// src/components/HexUnit.jsx
import React from 'react';

/** 
 * Renders a small colored circle or icon for a unit on a given hex.
 * Props:
 *  - unit: { id, faction, type, tile: {row, col} }
 *  - size: pixel diameter
 */
export default function HexUnit({ unit, size = 16 }) {
  const colors = {
    Player1: 'blue',
    Player2: 'red',
    Player3: 'green',
    Player4: 'purple',
  };
  const color = colors[unit.faction] || 'black';

  return (
    <circle
      cx="50%" cy="50%"
      r={size / 2}
      fill={color}
      stroke="white"
      strokeWidth="2"
    />
  );
}

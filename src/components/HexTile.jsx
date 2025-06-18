// src/components/HexTile.jsx
import React from 'react';
import HexUnit from './HexUnit';

export default function HexTile({ tile, units, settlements, onTileClick, modelSelections = {} }) {
  const { row, col, terrain } = tile;

  // === layout math (you can tweak size/origin to match your board) ===
  const size   = 30; // hex “radius”
  const width  = size * 2;
  const height = Math.sqrt(3) / 2 * width;
  const x      = col * (size * 1.5);
  const y      = row * height + (col % 2) * (height / 2);

  // build the 6-point polygon
  const points = Array.from({ length: 6 }).map((_, i) => {
    const angle = Math.PI / 180 * (60 * i);
    const px = size * Math.cos(angle) + size;
    const py = size * Math.sin(angle) + size;
    return `${px},${py}`;
  }).join(' ');

  const terrainColors = {
    plains:   '#c2b280', // darkish yellow
    caves:    '#800080', // purple
    farmland: '#98fb98', // light green
    forest:   '#228B22', // dark green
    mountain: '#A9A9A9', // silver/grey
    water:    '#87CEFA', // blue
  };
  const fill = terrainColors[terrain] || '#EEE';

  return (
    <g transform={`translate(${x},${y})`} onClick={() => onTileClick(tile)}>
      {/* base hex */}
      <polygon points={points} fill={fill} stroke="#555" strokeWidth={1} />

      {/* any units on this tile */}
      {units
        .filter(u => u.tile?.row === row && u.tile?.col === col)
        .map(u => (
          <HexUnit
            key={u.id}
            unit={u}
            size={12}
            center={{ x: size, y: size }}
            modelSelections={modelSelections}
          />
        ))
      }

      {/* any settlement on this tile */}
      {settlements
        .filter(s => s.tile?.row === row && s.tile?.col === col)
        .map(s => {
          const imgSrc = modelSelections?.settlements?.[s.type];
          if (imgSrc) {
            const w = 20;
            const h = 20;
            const xPos = size - w / 2;
            const yPos = size * 1.6 - h / 2;
            return (
              <image
                key={s.id}
                href={imgSrc}
                x={xPos}
                y={yPos}
                width={w}
                height={h}
              />
            );
          }
          return (
            <text
              key={s.id}
              x={size}
              y={size * 1.6}
              textAnchor="middle"
              fontSize="10"
              fill="black"
            >
              {s.type[0]}
            </text>
          );
        })}
      
    </g>
  );
}

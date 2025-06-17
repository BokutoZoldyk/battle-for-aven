// src/components/GameScreen.jsx
import React, { useState, useEffect } from 'react';
import HexBoard from './HexBoard';
import Game     from '../models/Game';

export default function GameScreen({ players, rows, cols, onExit }) {
  // we only want to create the Game instance once
  const [game] = useState(() => {
    const g = new Game({ players });
    g.dealStartingAssets();
    return g;
  });

  // if you ever need to re-deal on rows/cols change:
  useEffect(() => {
    // e.g. you could call g.reset(rows,cols) here
  }, [rows, cols, game]);

  return (
    <div className="game-screen">
      <button className="back-btn" onClick={onExit}>
        ← Back to Menu
      </button>

      <h2>
        Game: {players} players — {rows}×{cols}
      </h2>

      {/* debug: show the raw game state */}
      <pre style={{ maxHeight: '200px', overflow: 'auto' }}>
        {JSON.stringify(game, null, 2)}
      </pre>

      {/* render your board */}
      <HexBoard rows={rows} cols={cols} />
    </div>
  );
}

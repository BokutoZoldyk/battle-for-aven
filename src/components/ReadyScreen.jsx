import React from 'react';
import PropTypes from 'prop-types';

export default function ReadyScreen({ config, onBack, onReady }) {
  const { players, rows, cols, faction, difficulty } = config;
  return (
    <div className="home">
      <h1>Ready to Play</h1>
      <p>Mode: Single Player</p>
      <p>Board: {players} players ({rows}×{cols})</p>
      <p>Your Faction: {faction}</p>
      <p>AI Difficulty: {difficulty}</p>
      <button onClick={onReady}>Start Game</button>
      <button onClick={onBack}>← Back</button>
    </div>
  );
}

ReadyScreen.propTypes = {
  config: PropTypes.shape({
    players: PropTypes.number,
    rows: PropTypes.number,
    cols: PropTypes.number,
    faction: PropTypes.string,
    difficulty: PropTypes.string,
  }).isRequired,
  onBack: PropTypes.func.isRequired,
  onReady: PropTypes.func.isRequired,
};
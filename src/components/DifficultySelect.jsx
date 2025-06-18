import React from 'react';
import PropTypes from 'prop-types';
import { AI_STRATEGIES } from '../AI/AIPlayer';

export default function DifficultySelect({ onBack, onSelect }) {
  return (
    <div className="home">
      <h1>Select AI Difficulty</h1>
      {Object.values(AI_STRATEGIES).map((strategy) => (
        <button key={strategy} onClick={() => onSelect(strategy)}>
          {strategy.charAt(0).toUpperCase() + strategy.slice(1)}
        </button>
      ))}
      <button onClick={onBack}>← Back</button>
    </div>
  );
}

DifficultySelect.propTypes = {
  onBack: PropTypes.func.isRequired,
  onSelect: PropTypes.func.isRequired,
};

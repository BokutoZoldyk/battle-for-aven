import React from 'react';
import PropTypes from 'prop-types';

export default function FactionSelect({ players, onBack, onSelect }) {
  const factions = Array.from({ length: players }, (_, i) => `Player${i + 1}`);
  return (
    <div className="home">
      <h1>Select Your Faction</h1>
      {factions.map((f) => (
        <button key={f} onClick={() => onSelect(f)}>
          {f}
        </button>
      ))}
      <button onClick={onBack}>← Back</button>
    </div>
  );
}

FactionSelect.propTypes = {
  players: PropTypes.number.isRequired,
  onBack: PropTypes.func.isRequired,
  onSelect: PropTypes.func.isRequired,
};

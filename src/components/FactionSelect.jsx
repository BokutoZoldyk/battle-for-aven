import React from 'react';
import PropTypes from 'prop-types';

export default function FactionSelect({ players, onBack, onSelect }) {
  const ALL_FACTIONS = [
    'The Kingdom of Avenguard',
    'Müselheim',
    'The Woodland Haven',
    'Sons of Rexathimgrod (Rex)',
    'The Amethyst Enclave',
    'The Farheed Commonwealth',
  ];
  // Show all factions regardless of player count
  const factions = ALL_FACTIONS;
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

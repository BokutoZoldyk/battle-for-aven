import React from 'react';

export default function SinglePlayerMenu({ onBack, onSelect }) {
  return (
    <div className="home">
      <h1>Select Board Size</h1>
      <button onClick={() => onSelect(4, 10, 10)}>4 Player (10×10)</button>
      <button onClick={() => onSelect(5, 12, 12)}>5 Player (12×12)</button>
      <button onClick={() => onSelect(6, 14, 14)}>6 Player (14×14)</button>
      <button onClick={onBack}>← Back</button>
    </div>
  );
}
import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';

export default function RulesPage({ onBack }) {
  const [rules, setRules] = useState('');

  useEffect(() => {
    // TODO: replace with actual rules text or fetch from an asset file
    setRules(`Insert your game rules here...`);
  }, []);

  return (
    <div className="home rules">
      <h1>How to Play</h1>
      <div className="rules-text">
        {rules.split('\n').map((line, i) => (
          <p key={i}>{line}</p>
        ))}
      </div>
      <button onClick={onBack}>← Back</button>
    </div>
  );
}

RulesPage.propTypes = {
  onBack: PropTypes.func.isRequired,
};
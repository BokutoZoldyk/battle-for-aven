import React, { useState } from 'react';
import HomePage   from './components/HomePage';
import GameScreen from './components/GameScreen';
import './App.css';

function App() {
  const [config, setConfig] = useState(null);

  const handleStart = (players, size) => {
    setConfig({ players, rows: size, cols: size });
  };

  return (
    <div className="App">
      {!config
        ? <HomePage   onStartGame={handleStart} />
        : <GameScreen
            players={config.players}
            rows={config.rows}
            cols={config.cols}
            onExit={() => setConfig(null)}
          />
      }
    </div>
  );
}

export default App;

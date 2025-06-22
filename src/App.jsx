import React, { useState } from 'react';
import './App.css';

import MainMenu from './components/MainMenu';
import SinglePlayerMenu from './components/SinglePlayerMenu';
import FactionSelect from './components/FactionSelect';
import DifficultySelect from './components/DifficultySelect';
import ReadyScreen from './components/ReadyScreen';
import GameScreen from './components/GameScreen';
import RulesPage from './components/RulesPage';

export default function App() {
  const [screen, setScreen] = useState('menu');
  const [config, setConfig] = useState({
    players: 4,
    rows: 10,
    cols: 10,
    faction: 'Player1',
    difficulty: 'balanced',
  });

  const goMenu = () => setScreen('menu');

  const handleBoardSelect = (players, rows, cols) => {
    setConfig((c) => ({ ...c, players, rows, cols }));
    setScreen('faction');
  };

  const handleFactionSelect = (f) => {
    setConfig((c) => ({ ...c, faction: f }));
    setScreen('difficulty');
  };

  const handleDifficultySelect = (d) => {
    setConfig((c) => ({ ...c, difficulty: d }));
    setScreen('ready');
  };

  const startGame = () => {
    setScreen('game');
  };

  switch (screen) {
    case 'menu':
      return (
        <MainMenu
          onSinglePlayer={() => setScreen('boards')}
          onMultiplayer={goMenu}
          onRules={() => setScreen('rules')}
        />
      );
    case 'boards':
      return (
        <SinglePlayerMenu onBack={goMenu} onSelect={handleBoardSelect} />
      );
    case 'faction':
      return (
        <FactionSelect
          players={config.players}
          onBack={() => setScreen('boards')}
          onSelect={handleFactionSelect}
        />
      );
    case 'difficulty':
      return (
        <DifficultySelect
          onBack={() => setScreen('faction')}
          onSelect={handleDifficultySelect}
        />
      );
    case 'ready':
      return (
        <ReadyScreen
          config={config}
          onBack={() => setScreen('difficulty')}
          onReady={startGame}
        />
      );
    case 'rules':
      return <RulesPage onBack={goMenu} />;
    case 'game':
      return (
        <GameScreen
          onBack={goMenu}
          players={config.players}
          rows={config.rows}
          cols={config.cols}
          faction={config.faction}
        />
      );
    default:
      return null;
  }
}

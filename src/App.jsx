import React, { useState, useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import GameEngine from './game/GameEngine';

import { AI_STRATEGIES } from './AI/AIPlayer';
import HexBoard from './components/HexBoard';
 
 export default function GameScreen({
   onBack,
   players = 4,
   rows = 10,
   cols = 10,
  aiConfig = [],
 }) {
   // === Engine setup ===
   const engineRef = useRef(null);
   const [gameState, setGameState] = useState(null);
   const [phase, setPhase] = useState(null);
  const [aiConfiguration] = useState(aiConfig);
 
   useEffect(() => {
    engineRef.current = new GameEngine({ players, rows, cols });
    engineRef.current = new GameEngine({ players, rows, cols, aiConfig: aiConfiguration });
     setGameState(engineRef.current.game.getState());
     setPhase(engineRef.current.game.phase);
   }, []);

GameScreen.propTypes = {
   onBack: PropTypes.func.isRequired,
   players: PropTypes.number,
   rows: PropTypes.number,
   cols: PropTypes.number,
  aiConfig: PropTypes.array,
};
 }

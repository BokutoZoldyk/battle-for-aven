// src/components/GameScreen.jsx

import React, { useState, useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import GameEngine from '../game/GameEngine';
import { AI_STRATEGIES } from '../AI/AIPlayer';
import HexBoard from './HexBoard';
import buildingData from '../data/buildings.json';
import calamityData from '../data/calamities.json';
import { PLACEHOLDERS } from '../assets/modelPlaceholders';

export default function GameScreen({
  onBack,
  players = 4,
  rows = 10,
  cols = 10,
}) {
  // === Engine setup ===
  const engineRef = useRef(null);
  const [gameState, setGameState] = useState(null);
  const [phase, setPhase] = useState('setup'); // 'setup' | 'build' | 'move' | 'waiting'
  const [selectedUnit, setSelectedUnit] = useState(null);
  const [buildTile, setBuildTile] = useState(null);
  const [buildTab, setBuildTab] = useState('units');
  const modelOptions = [PLACEHOLDERS.red, PLACEHOLDERS.green, PLACEHOLDERS.blue];
  const [modelSelections, setModelSelections] = useState({
    units: {},
    settlements: {},
    buildings: {},
    calamities: {},
  });

  useEffect(() => {
    engineRef.current = new GameEngine({
      players,
      rows,
      cols,
      aiConfig: [
        { id: 'Player2', strategy: AI_STRATEGIES.AGGRESSIVE },
        { id: 'Player3', strategy: AI_STRATEGIES.BALANCED },
        { id: 'Player4', strategy: AI_STRATEGIES.DEFENSIVE },
      ],
    });
    setGameState(engineRef.current.getState());
    setPhase('setup');
  }, [players, rows, cols]);

  const refresh = () => setGameState(engineRef.current.getState());

  const updateModel = (category, type, value) => {
    setModelSelections((prev) => ({
      ...prev,
      [category]: { ...prev[category], [type]: value },
    }));
  };

  // === Action handlers ===
  const handleBuild = (unitType) => {
    engineRef.current.game.applyBuild({
      playerId: 'Player1',
      unitType,
      tile: buildTile,
    });
    setBuildTile(null);
    refresh();
  };

  const handleMove = (tile) => {
    engineRef.current.game.applyMove({
      unitId: selectedUnit.id,
      target: tile,
    });
    setSelectedUnit(null);
    refresh();
  };

  const handleTileClick = (tile) => {
    if (phase === 'setup') {
      const options = gameState.startZones?.Player1 || [];
      const allowed = options.some(
        (t) => t.row === tile.row && t.col === tile.col
      );
      if (allowed) {
        engineRef.current.placeStartingCity('Player1', tile);
        refresh();
        setPhase('build');
      }
      return;
    }
    if (phase === 'build') {
      const occupied = gameState.units.some(
        (u) => u.tile?.row === tile.row && u.tile?.col === tile.col
      );
      if (!occupied) {
        setBuildTile(tile);
        setSelectedUnit(null);
      }
    } else if (phase === 'move') {
      if (selectedUnit) {
        handleMove(tile);
      } else {
        const unit = gameState.units.find(
          (u) =>
            u.faction === 'Player1' &&
            u.tile?.row === tile.row &&
            u.tile?.col === tile.col
        );
        if (unit) {
          setSelectedUnit(unit);
          setBuildTile(null);
        }
      }
    }
  };

  const endBuildPhase = () => {
    setBuildTile(null);
    setPhase('move');
  };
  const endMovePhase = () => {
    setSelectedUnit(null);
    setPhase('waiting');
  };
  const resolveAndAdvance = () => {
    engineRef.current.nextTurn();
    refresh();
    setPhase('build');
  };

  if (!gameState) return <div>Loading…</div>;

  // === Render data ===
  const {
    turn,
    winner,
    tiles,
    units,
    settlements,
    playersState,
    unitStats,
  } = gameState;

  const resources = playersState.Player1.resources;
  const techTier = playersState.Player1.techTier;

  const affordable = unitStats
    .filter((u) => u.tier <= techTier)
    .filter((u) =>
      Object.entries(u.cost || {}).every(
        ([res, amt]) => (resources[res] || 0) >= amt
      )
    );

  return (
    <div style={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* HEADER */}
      <header
        style={{
          display: 'flex',
          alignItems: 'center',
          padding: '8px 16px',
          background: '#333',
          color: '#fff',
        }}
      >
        <button
          onClick={onBack}
          style={{
            background: 'transparent',
            border: 'none',
            color: '#fff',
            fontSize: '18px',
            cursor: 'pointer',
          }}
        >
          ← Back
        </button>
        <h1 style={{ margin: '0 16px', fontSize: '20px' }}>
          Battle for Aven
        </h1>
        <div style={{ marginLeft: 'auto' }}>
          <strong>Turn {turn}</strong>
          {winner && (
            <span style={{ marginLeft: 16, color: '#ff0' }}>
              🏆 {winner} wins!
            </span>
          )}
        </div>
      </header>

      {/* MAIN */}
      <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
        {/* SIDEBAR */}
        <aside
          style={{
            width: '260px',
            padding: '16px',
            background: '#f0f0f0',
            overflowY: 'auto',
            boxSizing: 'border-box',
          }}
        >
          {phase === 'setup' && (
            <>
              <h2>Starting Placement</h2>
              <p>Select a highlighted tile for your City.</p>
            </>
          )}
          {phase === 'build' && (
            <>
              <h2>Build Phase</h2>
              <button onClick={endBuildPhase}>End Build</button>
              <div
                style={{
                  marginTop: 8,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 8,
                  alignItems: 'flex-start',
                }}
              >
                <button onClick={() => setBuildTab('settlements')}>
                  Settlements
                </button>
                <button onClick={() => setBuildTab('buildings')}>
                  Buildings
                </button>
                <button onClick={() => setBuildTab('units')}>
                  Units
                </button>
                <button onClick={() => setBuildTab('calamities')}>
                  Calamities
                </button>
              </div>
              {buildTab === 'units' && (
                <div style={{ marginTop: 8 }}>
                  {unitStats.map(u => (
                    <div key={u.type} style={{ marginBottom: 4 }}>
                      <label>
                        {u.type}
                        <select
                          value={modelSelections.units[u.type] || modelOptions[0]}
                          onChange={e => updateModel('units', u.type, e.target.value)}
                          style={{ marginLeft: 4 }}
                        >
                          {modelOptions.map(opt => (
                            <option key={opt} value={opt}>{opt.split('/').pop()}</option>
                          ))}
                        </select>
                      </label>
                    </div>
                  ))}
                </div>
              )}
              {buildTab === 'settlements' && (
                <div style={{ marginTop: 8 }}>
                  {[...new Set(settlements.map(s => s.type))].map(t => (
                    <div key={t} style={{ marginBottom: 4 }}>
                      <label>
                        {t}
                        <select
                          value={modelSelections.settlements[t] || modelOptions[0]}
                          onChange={e => updateModel('settlements', t, e.target.value)}
                          style={{ marginLeft: 4 }}
                        >
                          {modelOptions.map(opt => (
                            <option key={opt} value={opt}>{opt.split('/').pop()}</option>
                          ))}
                        </select>
                      </label>
                    </div>
                  ))}
                </div>
              )}
              {buildTab === 'buildings' && (
                <div style={{ marginTop: 8 }}>
                  {[...new Set(buildingData.map(b => b.Type))].map(t => (
                    <div key={t} style={{ marginBottom: 4 }}>
                      <label>
                        {t}
                        <select
                          value={modelSelections.buildings[t] || modelOptions[0]}
                          onChange={e => updateModel('buildings', t, e.target.value)}
                          style={{ marginLeft: 4 }}
                        >
                          {modelOptions.map(opt => (
                            <option key={opt} value={opt}>{opt.split('/').pop()}</option>
                          ))}
                        </select>
                      </label>
                    </div>
                  ))}
                </div>
              )}
              {buildTab === 'calamities' && (
                <div style={{ marginTop: 8 }}>
                  {[...new Set(calamityData.map(c => c.Type))].map(t => (
                    <div key={t} style={{ marginBottom: 4 }}>
                      <label>
                        {t}
                        <select
                          value={modelSelections.calamities[t] || modelOptions[0]}
                          onChange={e => updateModel('calamities', t, e.target.value)}
                          style={{ marginLeft: 4 }}
                        >
                          {modelOptions.map(opt => (
                            <option key={opt} value={opt}>{opt.split('/').pop()}</option>
                          ))}
                        </select>
                      </label>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
          {phase === 'move' && (
            <>
              <h2>Move Phase</h2>
              <button onClick={endMovePhase}>End Move</button>
            </>
          )}
          {phase === 'waiting' && !winner && (
            <>
              <h2>Resolve & AI</h2>
              <button onClick={resolveAndAdvance}>
                Resolve Combat & AI Turn
              </button>
            </>
          )}

          {phase === 'build' && buildTile && buildTab === 'units' && (
            <div style={{ marginTop: '16px' }}>
              <h3>
                Build on ({buildTile.row}, {buildTile.col})
              </h3>
              {affordable.length ? (
                affordable.map((u) => (
                  <button
                    key={u.type}
                    style={{ display: 'block', margin: '4px 0' }}
                    onClick={() => handleBuild(u.type)}
                  >
                    {u.type} — {JSON.stringify(u.cost)}
                  </button>
                ))
              ) : (
                <p>Nothing affordable</p>
              )}
              <button onClick={() => setBuildTile(null)}>Cancel</button>
            </div>
          )}

          {phase === 'move' && selectedUnit && (
            <div style={{ marginTop: '16px' }}>
              <h3>Moving {selectedUnit.type}</h3>
              <button onClick={() => setSelectedUnit(null)}>Cancel</button>
            </div>
          )}

          <section style={{ marginTop: '24px' }}>
            <h2>Resources</h2>
            <ul style={{ listStyle: 'none', padding: 0 }}>
              {Object.entries(resources).map(([res, amt]) => (
                <li key={res}>
                  {res.charAt(0).toUpperCase() + res.slice(1)}: {amt}
                </li>
              ))}
            </ul>
          </section>
        </aside>

        {/* BOARD */}
        <main
          style={{
            flex: 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: '#e2e2e2',
          }}
        >
          <div
            style={{
              width: '100%',
              height: '100%',
              overflow: 'auto',
              padding: '8px',
              boxSizing: 'border-box',
            }}
          >
            <HexBoard
              tiles={tiles}
              units={units}
              settlements={settlements}
              onTileClick={handleTileClick}
              highlightTiles={
                phase === 'setup' ? gameState.startZones.Player1 : buildTile ? [buildTile] : []
              }
              // pass rows/cols so HexBoard can size itself responsively
              rows={rows}
              cols={cols}
              modelSelections={modelSelections}
            />
          </div>
        </main>
      </div>
    </div>
  );
}

GameScreen.propTypes = {
  onBack: PropTypes.func.isRequired,
  players: PropTypes.number,
  rows: PropTypes.number,
  cols: PropTypes.number,
};

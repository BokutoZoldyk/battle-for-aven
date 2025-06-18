// src/game/GameEngine.js
import Game from '../models/Game';
import CalamityManager from './CalamityManager';
import AIPlayer, { AI_STRATEGIES } from '../AI/AIPlayer';

export default class GameEngine {
  constructor({ players = 4, rows = 10, cols = 10, aiConfig = [] } = {}) {
    this.game = new Game({ players, rows, cols });
    this.calamities = new CalamityManager(this.game);
    this.turnOrder = [];           // e.g. ['Player1','Player2',...]
    this.aiPlayers = [];
    this.startZones = {};

    // set up AI players
    aiConfig.forEach(({ id, strategy }) => {
      this.aiPlayers.push(new AIPlayer(id, strategy));
    });

    this._initStartZones(players, rows, cols);
    // automatically place AI players
    for (let p = 2; p <= players; p++) {
      const zone = this.startZones[`Player${p}`] || [];
      if (zone.length) this.placeStartingCity(`Player${p}`, zone[0]);
    }

    // spawn calamities after setup
    this.calamities.spawnInitial(players);

    // build the turn order
    for (let p = 1; p <= players; p++) {
      this.turnOrder.push(`Player${p}`);
    }
    this.winner = null;
  }

  _initStartZones(players, rows, cols) {
    for (let p = 1; p <= players; p++) {
      const options = [];
      while (options.length < 7) {
        const row = Math.floor(Math.random() * (rows - 2)) + 1; // 1..rows-2
        const col = Math.floor(Math.random() * (cols - 2)) + 1; // 1..cols-2
        const key = `${row},${col}`;
        if (!options.some(t => `${t.row},${t.col}` === key)) {
          options.push({ row, col });
        }
      }
      this.startZones[`Player${p}`] = options;
    }
  }

  placeStartingCity(playerId, tile) {
    const city = this.game.settlements.find(
      s => s.faction === playerId && s.type === 'City'
    );
    if (city) city.tile = tile;

    const soldier = this.game.units.find(
      u => u.type === 'Soldier' && u.faction === playerId
    );
    if (soldier) soldier.tile = { row: tile.row, col: Math.min(tile.col + 1, this.game.cols - 1) };

    const archer = this.game.units.find(
      u => u.type === 'Archer' && u.faction === playerId
    );
    if (archer) archer.tile = { row: tile.row, col: Math.max(tile.col - 1, 0) };

    // once placed, clear zone for player
    this.startZones[playerId] = [];
  }

  nextTurn() {
    if (this.winner) return;

    // 1) BUILD phase
    this.aiPlayers.forEach(ai => {
      const builds = ai.decideBuildPhase(this.game.getState());
      builds.forEach(action => this.game.applyBuild(action));
    });

    // 2) MOVE phase
    const moves = this.aiPlayers.flatMap(ai =>
      ai.decideMovementPhase(this.game.getState())
    );
    moves.forEach(m => this.game.applyMove(m));

    // 3) COMBAT phase
    // (Your Game.resolveCombatAll handles multi‐party simultaneous rolls)
    this.game.resolveCombatAll();

    // 4) RESOURCE COLLECTION & UPKEEP
    this.game.collectResources();

    // 5) OBJECTIVE CHECK (e.g. pop ≥70 or 5 objectives)
    this._checkObjectives();

    // 6) WIN CHECK
    this.winner = this.game.checkWin() || this.winner;

    // advance turn counter
    this.game.turn += 1;
  }

  getState() {
    return {
      ...this.game.getState(),
      turn: this.game.turn,
      winner: this.winner,
      startZones: this.startZones,
    };
  }

  _checkObjectives() {
    // simple example: count units killed per faction in playersState
    const ps = this.game.playersState;
    for (let playerId of Object.keys(ps)) {
      if (ps[playerId].objectives == null) {
        ps[playerId].objectives = 0;
      }
      // e.g. +1 objective for reaching pop 70
      if (ps[playerId].population >= 70 && !ps[playerId]._wonByPop) {
        ps[playerId]._wonByPop = true;
        ps[playerId].objectives += 1;
      }
      // TODO: add your other objectives (10 kills, 200 gold, etc.)
      if (ps[playerId].objectives >= 5) {
        this.winner = playerId;
      }
    }
  }
}

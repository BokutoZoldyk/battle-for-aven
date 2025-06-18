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

    // set up AI players
    aiConfig.forEach(({ id, strategy }) => {
      this.aiPlayers.push(new AIPlayer(id, strategy));
    });

    // initial deal
    this.game.dealStartingAssets();
    // place the starting Archer next to each HQ
    for (let p = 1; p <= players; p++) {
      const archer = this.game.units.find(
        u => u.type === 'Archer' && u.faction === `Player${p}`
      );
      const hq = this.game.settlements.find(
        s => s.faction === `Player${p}` && s.type === 'City'
      );
      if (archer && hq && hq.tile) {
        archer.tile = { row: hq.tile.row, col: hq.tile.col + 1 };
      }
    }

    // spawn calamities
    this.calamities.spawnInitial(players);

    // build the turn order
    for (let p = 1; p <= players; p++) {
      this.turnOrder.push(`Player${p}`);
    }
    this.winner = null;
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

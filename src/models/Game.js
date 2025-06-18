// src/models/Game.js
import { makeInitialTiles } from '../data/initialTiles';
import { allUnits }        from '../data/initialUnits';
import { allSettlements }  from '../data/initialSettlements';

export default class Game {
  constructor({ players = 4, rows = 10, cols = 10 } = {}) {
    this.players    = players;
    this.turn       = 1;
    this.rows       = rows;
    this.cols       = cols;
    this.tiles      = makeInitialTiles(rows, cols);

    // clone your data so you can mutate safely:
    this.units       = allUnits.map(u => ({ ...u, tile: null }));
    this.settlements = allSettlements.map(s => ({ ...s, tile: null }));

    // keep a copy of your “stats” to look up costs, rolls, etc:
    this.unitStats = allUnits.map(u => ({ ...u }));
    // simple player state for resources, tech tier, population, etc:
    this.playersState = {};
    for (let p = 1; p <= this.players; p++) {
      this.playersState[`Player${p}`] = {
        resources: { gold: 5, food: 5, wood: 0, metal: 0, crystal: 0 },
        techTier: 1,
        population: 1,
      };
    }
  }

  dealStartingAssets() {
    const corners = [
      { row: 0, col: 0 },
      { row: 0, col: this.cols - 1 },
      { row: this.rows - 1, col: 0 },
      { row: this.rows - 1, col: this.cols - 1 },
    ];

    for (let p = 1; p <= this.players; p++) {
      const corner = corners[p - 1];
      // place HQ
      const hq = this.settlements.find(
        s => s.type === 'City' && s.faction === `Player${p}`
      );
      if (hq) hq.tile = corner;

      // place one Tier-1 soldier next to it
      const soldier = this.units.find(
        u => u.type === 'Soldier' && u.faction === `Player${p}`
      );
      if (soldier) soldier.tile = { row: corner.row, col: corner.col + 1 };
    }
  }

  checkWin() {
    const alive = new Set(
      this.units.filter(u => u.hp > 0).map(u => u.faction)
    );
    return alive.size === 1 ? [...alive][0] : null;
  }

  nextTurn({ aiPlayers = [] } = {}) {
    // 1) BUILD
    aiPlayers.forEach(ai => {
      const builds = ai.decideBuildPhase(this.getState());
      builds.forEach(b => this.applyBuild(b));
    });

    // 2) MOVE
    const allMoves = aiPlayers.flatMap(ai =>
      ai.decideMovementPhase(this.getState())
    );
    allMoves.forEach(m => this.applyMove(m));

    // 3) COMBAT
    this.resolveCombatAll();

    // 4) INCOME / UPKEEP / TECH
    this.collectResources();

    this.turn++;
  }

  applyBuild({ playerId, unitType, tile }) {
    const player = this.playersState[playerId];
    const stats  = this.unitStats.find(u => u.type === unitType);
    if (!player || !stats) return;

    // check cost
    const cost = stats.cost || {};
    if (
      !Object.entries(cost).every(
        ([res, amt]) => (player.resources[res] || 0) >= amt
      )
    ) {
      return; // can't afford
    }

    // deduct cost
    Object.entries(cost).forEach(([res, amt]) => {
      player.resources[res] -= amt;
    });

    // find a fresh unit of that type & place it
    const u = this.units.find(
      u =>
        u.faction === playerId && u.type === unitType && u.tile == null
    );
    if (u) u.tile = tile;
  }

  applyMove({ unitId, target }) {
    const u = this.units.find(u => u.id === unitId);
    if (u) u.tile = target;
  }

  resolveCombatAll() {
    // group units by tile
    const byTile = {};
    this.units.forEach(u => {
      if (!u.tile) return;
      const key = `${u.tile.row},${u.tile.col}`;
      byTile[key] = byTile[key] || [];
      byTile[key].push(u);
    });

    // for each contested stack, do simple simultaneous rolls
    Object.values(byTile).forEach(stack => {
      const factions = [...new Set(stack.map(u => u.faction))];
      if (factions.length <= 1) return;

      stack.forEach(u => {
        // parse your offensiveRoll string however you like; here’s a quick
        // “X d6 ≥ threshold” simulator if you stored rolls/threshold on the unit:
        const rolls = u.offensiveRoll?.rolls || 1;
        const thresh = u.offensiveRoll?.threshold || 5;
        let hits = 0;
        for (let i = 0; i < rolls; i++) {
          if (Math.ceil(Math.random() * 6) >= thresh) hits++;
        }

        // spread hits out round‐robin among enemies
        const enemies = stack.filter(v => v.faction !== u.faction);
        for (let i = 0; i < hits; i++) {
          const victim = enemies[i % enemies.length];
          victim.hp -= 1;
        }
      });
    });

    // cull the dead
    this.units = this.units.filter(u => u.hp > 0);
  }

  collectResources() {
    // very simple: each City yields +1 gold
    this.settlements.forEach(s => {
      if (s.tile && s.type === 'City') {
        this.playersState[s.faction].resources.gold += 1;
      }
    });
  }

  getState() {
    return {
      players:     this.players,
      turn:        this.turn,
      rows:        this.rows,
      cols:        this.cols,
      tiles:       this.tiles,
      units:       this.units,
      settlements: this.settlements,
      playersState: this.playersState,
      unitStats:    this.unitStats,
    };
  }
}

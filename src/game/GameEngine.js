const { makeInitialTiles } = require('../data/initialTiles');
const rawUnits = require('../data/units.json');
const allUnits = rawUnits.map(u => ({
  type: u.Type,
  cost: {
    gold: u['Gold Cost'] || u.Gold || 0,
    food: u['Food Cost'] || u.Food || 0,
    wood: u['Wood Cost'] || u.Wood || 0,
    metal: u['Metal Cost'] || u.Metal || 0,
    crystal: u['Crystal Cost'] || u.Crystal || 0,
  },
}));

class GameEngine {
  constructor({ players = 2, rows = 10, cols = 10 } = {}) {
    this.rows = rows;
    this.cols = cols;
    this.tiles = makeInitialTiles(rows, cols);
    this.turn  = 1;

    this.players = Array.from({ length: players }, (_, id) => ({
      id,
      resources: { gold: 10, food: 10, wood: 10, metal: 0, crystal: 0 },
      units: []
    }));

    this.units = [];
  }

  getTile(row, col) {
    return this.tiles[row] && this.tiles[row][col];
  }

  canAfford(player, cost) {
    return Object.entries(cost).every(([k, v]) => (player.resources[k] || 0) >= v);
  }

  spendResources(player, cost) {
    for (const [k, v] of Object.entries(cost)) {
      player.resources[k] = (player.resources[k] || 0) - v;
    }
  }

  /**
   * Place a unit on the board if the tile is free and the player can afford it.
   * Returns the new unit or null on failure.
   */
  spawnUnit(playerId, unitType, row, col) {
    const tile = this.getTile(row, col);
    if (!tile || tile.unit) return null;
    const unitData = allUnits.find(u => u.type === unitType);
    if (!unitData) return null;
    const player = this.players[playerId];
    if (!this.canAfford(player, unitData.cost)) return null;
    this.spendResources(player, unitData.cost);
    const unit = { ...unitData, owner: playerId, row, col };
    tile.unit = unit;
    player.units.push(unit);
    this.units.push(unit);
    return unit;
  }

  moveUnit(unit, targetRow, targetCol) {
    const target = this.getTile(targetRow, targetCol);
    if (!target || target.unit) return false;
    const current = this.getTile(unit.row, unit.col);
    if (current) current.unit = null;
    target.unit = unit;
    unit.row = targetRow;
    unit.col = targetCol;
    return true;
  }

  nextTurn() {
    this.turn += 1;
  }
}

module.exports = GameEngine;

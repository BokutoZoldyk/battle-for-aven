const rawUnits = require('../data/units.json');
const allUnits = rawUnits.map(u => ({
  type: u.Type,
  cost: {
    gold: u['Gold Cost'] || u.Gold || 0,
    food: u['Food Cost'] || u.Food || 0,
    wood: u['Wood Cost'] || u.Wood || 0,
    metal: u['Metal Cost'] || u.Metal || 0,
    crystal: u['Crystal Cost'] || u.Crystal || 0,
  }
}));

const STRATEGIES = {
  AGGRESSIVE: 'aggressive',
  DEFENSIVE: 'defensive',
  BALANCED: 'balanced',
};

class SimpleAI {
  constructor(playerId, strategy = STRATEGIES.BALANCED) {
    this.playerId = playerId;
    this.strategy = strategy;
  }

  takeTurn(engine) {
    this._build(engine);
    this._move(engine);
  }

  _build(engine) {
    const player = engine.players[this.playerId];
    const unitType = 'Soldier';
    const unitData = allUnits.find(u => u.type === unitType);
    const cost = unitData ? unitData.cost : { gold: 4, food: 2, wood: 2, metal: 0, crystal: 0 };
    if (!engine.canAfford(player, cost)) return;
    for (let r = 0; r < engine.rows; r++) {
      for (let c = 0; c < engine.cols; c++) {
        const tile = engine.getTile(r, c);
        if (tile && !tile.unit) {
          engine.spawnUnit(this.playerId, unitType, r, c);
          return;
        }
      }
    }
  }

  _move(engine) {
    const player = engine.players[this.playerId];
    for (const unit of player.units) {
      const target = this._findAdjacentFree(engine, unit);
      if (target) engine.moveUnit(unit, target.row, target.col);
    }
  }

  _findAdjacentFree(engine, unit) {
    const dirs = [ [1,0], [-1,0], [0,1], [0,-1] ];
    for (const [dr, dc] of dirs) {
      const r = unit.row + dr;
      const c = unit.col + dc;
      const tile = engine.getTile(r, c);
      if (tile && !tile.unit) return { row: r, col: c };
    }
    return null;
  }
}

module.exports = { SimpleAI, STRATEGIES };

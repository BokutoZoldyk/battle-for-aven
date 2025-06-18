// src/ai/AIPlayer.js

/**
 * AI Player module for Battle for Aven.
 * Implements simple strategies: aggressive, defensive, balanced.
 */
export const AI_STRATEGIES = {
  AGGRESSIVE: 'aggressive',
  DEFENSIVE: 'defensive',
  BALANCED:  'balanced',
};

export default class AIPlayer {
  constructor(playerId, strategy = AI_STRATEGIES.BALANCED) {
    this.playerId = playerId;
    this.strategy = strategy;
  }

  /**
   * Decide build-phase actions based on available resources and strategy.
   * @param {Object} gameState - current game state
   * @returns {Array} list of build actions e.g. [{type: 'build', unit: 'Soldier', tile}]
   */
  decideBuildPhase(gameState) {
    const actions = [];
    const me = gameState.players[this.playerId];
    const resources = {...me.resources};

    // Gather possible builds from stats
    const candidates = gameState.unitStats.filter(u => u.tier <= me.techTier);

    // Prioritize by strategy
    let sorted;
    switch (this.strategy) {
      case AI_STRATEGIES.AGGRESSIVE:
        // build highest offense units first
        sorted = candidates.sort((a, b) => b.attack - a.attack);
        break;
      case AI_STRATEGIES.DEFENSIVE:
        // build highest defense units
        sorted = candidates.sort((a, b) => b.defense - a.defense);
        break;
      default:
        // balanced: mix attack and defense
        sorted = candidates.sort((a, b) => (b.attack + b.defense) - (a.attack + a.defense));
    }

    // Attempt builds within resource limits
    for (let unit of sorted) {
      if (this._canAfford(unit.cost, resources)) {
        // pick a spawn tile in zone of control
        const tile = this._chooseSpawnTile(gameState, unit);
        if (tile) {
          actions.push({ type: 'build-unit', unit: unit.id, tile });
          this._spendResources(resources, unit.cost);
        }
      }
    }
    return actions;
  }

  /**
   * Decide movement-phase actions: where to move each unit.
   * @param {Object} gameState
   * @returns {Array} list of move actions e.g. [{unitId, from, to}]
   */
  decideMovementPhase(gameState) {
    const actions = [];
    const units = gameState.units.filter(u => u.owner === this.playerId);

    for (let unit of units) {
      const target = this._selectMovementTarget(unit, gameState);
      if (target && target !== unit.tile) {
        actions.push({ type: 'move-unit', unitId: unit.id, from: unit.tile, to: target });
      }
    }
    return actions;
  }

  /**
   * Assign combat hits for multi-party engagements.
   * @param {Object} combatData
   * @returns {Array} list of assignment actions
   */
  decideCombatAssignments(combatData) {
    const assignments = [];
    // combatData.attacks: [{attackerId, targets, hits}]
    for (let atk of combatData.attacks.filter(a => a.owner === this.playerId)) {
      // allocate hits per strategy: aggressive focuses on weakest
      const opponents = atk.targets;
      const sortedOpp = [...opponents];
      if (this.strategy === AI_STRATEGIES.AGGRESSIVE) {
        sortedOpp.sort((a, b) => a.hp - b.hp);
      } else if (this.strategy === AI_STRATEGIES.DEFENSIVE) {
        sortedOpp.sort((a, b) => b.threat - a.threat);
      }
      let hitsLeft = atk.hits;
      for (let opp of sortedOpp) {
        if (hitsLeft <= 0) break;
        const assign = Math.min(hitsLeft, opp.hp);
        assignments.push({ attackerId: atk.attackerId, targetId: opp.id, hits: assign });
        hitsLeft -= assign;
      }
    }
    return assignments;
  }

  // --- Helpers ---
  _canAfford(cost, resources) {
    return Object.entries(cost).every(([res, amt]) => (resources[res] || 0) >= amt);
  }

  _spendResources(resources, cost) {
    for (let [res, amt] of Object.entries(cost)) resources[res] -= amt;
  }

  _chooseSpawnTile(gameState, unit) {
    // choose first free tile in zone of control
    const zoc = gameState.getZoneOfControl(this.playerId);
    return zoc.find(t => gameState.canSpawn(unit.id, t));
  }

  _selectMovementTarget(unit, gameState) {
    // aggressive: nearest enemy, defensive: nearest friendly settlement, balanced: mix
    const neighbors = gameState.map.getReachable(unit.tile, unit.move);
    if (neighbors.length === 0) return null;
    if (this.strategy === AI_STRATEGIES.AGGRESSIVE) {
      return gameState.findNearestEnemy(unit.tile, this.playerId, neighbors);
    }
    if (this.strategy === AI_STRATEGIES.DEFENSIVE) {
      return gameState.findNearestFriendlySettlement(unit.tile, this.playerId, neighbors);
    }
    // balanced: if health low -> defensive else aggressive
    if (unit.hp < unit.maxHp * 0.5) {
      return gameState.findNearestFriendlySettlement(unit.tile, this.playerId, neighbors);
    }
    return gameState.findNearestEnemy(unit.tile, this.playerId, neighbors);
  }
}

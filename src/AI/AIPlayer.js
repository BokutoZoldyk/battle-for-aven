// src/AI/AIPlayer.js
export const AI_STRATEGIES = {
  AGGRESSIVE: 'aggressive',
  DEFENSIVE:  'defensive',
  BALANCED:   'balanced',
};

export default class AIPlayer {
  constructor(playerId, strategy = AI_STRATEGIES.BALANCED) {
    this.playerId = playerId;
    this.strategy = strategy;
  }

  /**
   * BUILD phase: choose what to build this turn.
   * Returns an array of { playerId, unitType, tile }.
   * This simple AI builds the cheapest available unit until population cap.
   */
  decideBuildPhase(gameState) {
    const me = gameState.players[this.playerId];
    const actions = [];

    // count current population vs cap
    const popCap = me.population;
    const popUsed = gameState.units
      .filter(u => u.faction === this.playerId).length;
    if (popUsed >= popCap) return actions;  // can't build more

    // gather all unit stats we can afford & tech tier
    const candidates = gameState.unitStats
      .filter(u => u.tier <= me.techTier)
      .filter(u => {
        // resource check
        return Object.entries(u.cost || {}).every(
          ([res, amt]) => (me.resources[res] || 0) >= amt
        );
      });
    if (candidates.length === 0) return actions;

    // pick one unit based on strategy
    let choice;
    if (this.strategy === AI_STRATEGIES.AGGRESSIVE) {
      // pick highest‐tier affordable
      choice = candidates.sort((a,b) => b.tier - a.tier)[0];
    } else if (this.strategy === AI_STRATEGIES.DEFENSIVE) {
      // pick lowest‐cost unit
      choice = candidates.sort((a,b) => {
        const costA = Object.values(a.cost||{}).reduce((s,x)=>s+x,0);
        const costB = Object.values(b.cost||{}).reduce((s,x)=>s+x,0);
        return costA - costB;
      })[0];
    } else {
      // balanced: mid‐tier
      choice = candidates[Math.floor(candidates.length/2)];
    }

    // find a controlled tile to spawn on (any settlement tile)
    const spawnTiles = gameState.settlements
      .filter(s => s.faction === this.playerId && s.tile)
      .map(s => s.tile);
    if (spawnTiles.length) {
      actions.push({
        playerId: this.playerId,
        unitType: choice.type,
        tile: spawnTiles[0],
      });
    }
    return actions;
  }

  /**
   * MOVE phase: move each unit toward a target.
   * Returns array of { unitId, target }.
   */
  decideMovementPhase(gameState) {
    const actions = [];
    const myUnits = gameState.units.filter(u => u.faction === this.playerId);

    for (let unit of myUnits) {
      const neighbors = gameState.map.getNeighbors(unit.tile);
      if (neighbors.length === 0) continue;

      let target;
      switch (this.strategy) {
        case AI_STRATEGIES.AGGRESSIVE:
          target = gameState.findNearestEnemy(unit.tile, this.playerId, neighbors);
          break;
        case AI_STRATEGIES.DEFENSIVE:
          target = gameState.findNearestFriendlySettlement(unit.tile, this.playerId, neighbors);
          break;
        default:
          // balanced: retreat if hurt, else attack
          if (unit.hp < (unit.maxHp * 0.5)) {
            target = gameState.findNearestFriendlySettlement(unit.tile, this.playerId, neighbors);
          } else {
            target = gameState.findNearestEnemy(unit.tile, this.playerId, neighbors);
          }
      }
      if (target && (target.row !== unit.tile.row || target.col !== unit.tile.col)) {
        actions.push({ unitId: unit.id, target });
      }
    }
    return actions;
  }

  /**
   * COMBAT phase (multi‐party): assign hits
   * For now, simple split across all opponents.
   */
  decideCombatAssignments(combatData) {
    const assignments = [];
    for (let fight of combatData) {
      const { attackerId, hits, opponents } = fight;
      let remaining = hits;
      for (let opp of opponents) {
        if (remaining <= 0) break;
        const take = Math.min(1, opp.hp);
        assignments.push({ attackerId, targetId: opp.id, hits: take });
        remaining -= take;
      }
    }
    return assignments;
  }
}

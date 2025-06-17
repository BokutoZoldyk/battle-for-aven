// src/models/Settlement.js

export default class Settlement {
  /**
   * @param {object} params
   * @param {number} params.id
   * @param {string} params.type
   * @param {number} params.tier
   * @param {string} params.faction
   * @param {number} params.goldIncome          // “Gold Income” column
   * @param {number} params.populationCapacity  // “Population” column
   * @param {number} params.hp                  // “HP” column
   * @param {string} params.defensiveRoll       // “Defensive Roll” column
   * @param {string} params.rangedRoll          // “Ranged roll” column
   * @param {number} params.buildingLimit       // “Building Limit” column
   * @param {number} params.zoneOfControl       // “Zone of Control” column
   * @param {number} params.resourcesPerAdjacentTile // “Resources per adjacent tile” column
   * @param {number} params.yieldFood           // “Food” column (yield)
   * @param {number} params.yieldWood           // “Wood” column (yield)
   * @param {number} params.yieldMetal          // “Metal” column (yield)
   * @param {number} params.costGold            // “Gold” column (cost)
   * @param {number} params.costFood            // “Food.1” column (cost)
   * @param {number} params.costWood            // “Wood” column (cost)
   * @param {number} params.costMetal           // “Metal” column (cost)
   */
  constructor({
    id, type, tier, faction,
    goldIncome, populationCapacity, hp,
    defensiveRoll = '', rangedRoll = '',
    buildingLimit, zoneOfControl,
    resourcesPerAdjacentTile,
    yieldFood, yieldWood, yieldMetal,
    costGold, costFood, costWood, costMetal
  }) {
    this.id                    = id;
    this.type                  = type;
    this.tier                  = tier;
    this.faction               = faction;
    this.goldIncome            = goldIncome;
    this.populationCapacity    = populationCapacity;
    this.hp                    = hp;
    this.defensiveRoll         = Settlement.parseRoll(defensiveRoll);
    this.rangedRoll            = Settlement.parseRoll(rangedRoll);
    this.buildingLimit         = buildingLimit;
    this.zoneOfControl         = zoneOfControl;
    this.resourcesPerAdjacentTile = resourcesPerAdjacentTile;

    // how much this settlement yields each turn
    this.yields = {
      gold: goldIncome,
      food: yieldFood,
      wood: yieldWood,
      metal: yieldMetal
    };

    // what it costs to build/upgrade
    this.cost = {
      gold: costGold,
      food: costFood,
      wood: costWood,
      metal: costMetal
    };
  }

  /**
   * Turn "2 for 3" into { rolls: 2, threshold: 3 }
   * Returns null on bad input.
   */
  static parseRoll(str) {
    if (typeof str !== 'string') return null;
    const m = str.match(/(\d+)\s*for\s*(\d+)/i);
    if (!m) return null;
    return { rolls: +m[1], threshold: +m[2] };
  }
}

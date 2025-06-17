// src/models/Unit.js

export default class Unit {
  /**
   * @param {object} params
   * @param {number} params.id
   * @param {string} params.type
   * @param {number} params.tier
   * @param {string} params.faction
   * @param {number} params.hp
   * @param {number} [params.specialRange=0]
   * @param {number} [params.range=0]
   * @param {string} [params.rangedRoll]   // e.g. "1 for 2"
   * @param {string} [params.offensiveRoll] // e.g. "1 for 3"
   * @param {string} [params.defensiveRoll] // e.g. "1 for 1"
   * @param {object} [params.cost]         // { gold, food, wood, metal, crystal, population }
   */
  constructor({
    id,
    type,
    tier,
    faction,
    hp,
    specialRange = 0,
    range = 0,
    rangedRoll = '',
    offensiveRoll = '',
    defensiveRoll = '',
    cost = {}
  }) {
    this.id            = id;
    this.type          = type;
    this.tier          = tier;
    this.faction       = faction;
    this.hp            = hp;
    this.specialRange  = specialRange;
    this.range         = range;
    // parse roll‐strings into { rolls, threshold } or null
    this.rangedRoll    = Unit.parseRoll(rangedRoll);
    this.offensiveRoll = Unit.parseRoll(offensiveRoll);
    this.defensiveRoll = Unit.parseRoll(defensiveRoll);

    // cost breakdown
    this.cost = {
      gold:       cost.gold       || 0,
      food:       cost.food       || 0,
      wood:       cost.wood       || 0,
      metal:      cost.metal      || 0,
      crystal:    cost.crystal    || 0,
      population: cost.population || 0
    };
  }

  /**
   * Parse a string like "2 for 3" into { rolls:2, threshold:3 }
   * @param {string} str
   * @returns {{rolls:number,threshold:number}|null}
   */
  static parseRoll(str) {
    if (typeof str !== 'string') return null;
    const m = str.match(/(\d+)\s*for\s*(\d+)/i);
    if (!m) return null;
    return { rolls: +m[1], threshold: +m[2] };
  }
}

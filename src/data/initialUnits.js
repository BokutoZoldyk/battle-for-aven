// src/data/initialUnits.js
import rawUnits from './units.json';
import Unit from '../models/Unit';

/**
 * allUnits: an array of Unit instances built
 * from your Excel → JSON data.
 */
export const allUnits = rawUnits.map(u => new Unit({
  id:             u['Unit ID'],
  type:           u.Type,
  tier:           u.Tier,
  faction:        u.Faction,
  hp:             u.HP,
  specialRange:   Number(u['Special range roll']) || 0,
  range:          u.Range ?? 0,
  rangedRoll:     u['Ranged Roll']        || '',
  offensiveRoll:  u['Offensive Roll']     || '',
  defensiveRoll:  u['Defensive Roll']     || '',
  cost: {
    gold:       Number(u['Gold Cost'])       || 0,
    food:       Number(u['Food Cost'])       || 0,
    wood:       Number(u['Wood Cost'])       || 0,
    metal:      Number(u['Metal Cost'])      || 0,
    crystal:    Number(u['Crystal Cost'])    || 0,
    population: Number(u['Population Cost']) || 0,
  }
}));

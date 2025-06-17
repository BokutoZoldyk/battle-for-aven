// src/data/initialUnits.js
import rawUnits from './units.json';
import Unit from '../models/Unit';

/**
 * allUnits: an array of Unit instances built
 * from your Excel → JSON data.
 */
export const allUnits = rawUnits.map(u => new Unit({
  id:             u.ID,
  type:           u.Type,
  tier:           u.Tier,
  faction:        u.Faction,
  hp:             u.HP,
  specialRange:   u.SpecialRange ?? 0,
  range:          u.Range ?? 0,
  rangedRoll:     u['Ranged roll']        || '',
  offensiveRoll:  u['Offensive Roll']     || '',
  defensiveRoll:  u['Defensive Roll']     || '',
  cost: {
    gold:       u.Gold     || 0,
    food:       u.Food     || 0,
    wood:       u.Wood     || 0,
    metal:      u.Metal    || 0,
    crystal:    u.Crystal  || 0,
    population: u.Population || 0,
  }
}));

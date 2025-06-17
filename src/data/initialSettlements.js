// src/data/initialSettlements.js
import rawSettlements from './settlements.json';
import Settlement from '../models/Settlement';

export const allSettlements = rawSettlements.map(s => new Settlement({
  id:                       s.ID,
  type:                     s.Type,
  tier:                     s.Tier,
  faction:                  s.Faction,
  goldIncome:               s['Gold Income'],
  populationCapacity:       s.Population,
  hp:                       s.HP,
  defensiveRoll:            s['Defensive Roll']  || '',
  rangedRoll:               s['Ranged roll']      || '',
  buildingLimit:            s['Building Limit'],
  zoneOfControl:            s['Zone of Control'],
  resourcesPerAdjacentTile: s['Resources per adjacent tile'],
  yieldFood:                s.Food,
  yieldWood:                s.Wood,
  yieldMetal:               s.Metal,
  costGold:                 s.Gold,
  costFood:                 s['Food.1'],
  costWood:                 s['Wood.1'],
  costMetal:                s['Metal.1']
}));

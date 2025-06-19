// src/data/initialSettlements.js
import rawSettlements from './settlements.json';
import Settlement from '../models/Settlement';

export const allSettlements = rawSettlements.map(s => new Settlement({
  id:                       s['Settlement ID'],
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
  yieldFood:                s['Food flat'] || 0,
  yieldWood:                s['Wood flat'] || 0,
  yieldMetal:               s['Metal flat'] || 0,
  costGold:                 Number(s.Gold) || 0,
  costFood:                 Number(s.Food) || 0,
  costWood:                 Number(s.Wood) || 0,
  costMetal:                Number(s.Metal) || 0
}));

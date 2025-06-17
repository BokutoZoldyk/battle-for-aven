// src/models/__tests__/Settlement.test.js

import Settlement from '../Settlement';

describe('Settlement model', () => {
  it('initializes correctly for a Tier 1 Town', () => {
    const data = {
      id: 11,
      type: 'town',
      tier: 1,
      faction: 'Standard',
      goldIncome: 2,
      populationCapacity: 5,
      hp: 1,
      defensiveRoll: '1 for 2',
      rangedRoll: '',            // none
      buildingLimit: 2,
      zoneOfControl: 1,
      resourcesPerAdjacentTile: 2,
      yieldFood: 2,
      yieldWood: 2,
      yieldMetal: 0,
      costGold: 8,
      costFood: 2,
      costWood: 2,
      costMetal: 0
    };

    const s = new Settlement(data);

    expect(s.id).toBe(11);
    expect(s.type).toBe('town');
    expect(s.tier).toBe(1);
    expect(s.faction).toBe('Standard');
    expect(s.goldIncome).toBe(2);
    expect(s.populationCapacity).toBe(5);
    expect(s.hp).toBe(1);
    expect(s.defensiveRoll).toEqual({ rolls: 1, threshold: 2 });
    expect(s.rangedRoll).toBeNull();
    expect(s.buildingLimit).toBe(2);
    expect(s.zoneOfControl).toBe(1);
    expect(s.resourcesPerAdjacentTile).toBe(2);

    expect(s.yields).toEqual({
      gold: 2,
      food: 2,
      wood: 2,
      metal: 0
    });

    expect(s.cost).toEqual({
      gold: 8,
      food: 2,
      wood: 2,
      metal: 0
    });
  });

  it('parseRoll returns null on invalid input', () => {
    expect(Settlement.parseRoll('')).toBeNull();
    expect(Settlement.parseRoll(null)).toBeNull();
    expect(Settlement.parseRoll('no match')).toBeNull();
  });

  it('parseRoll handles varied formatting', () => {
    expect(Settlement.parseRoll(' 3 FOR 5 ')).toEqual({ rolls: 3, threshold: 5 });
    expect(Settlement.parseRoll('10 for 2')).toEqual({ rolls: 10, threshold: 2 });
  });
});

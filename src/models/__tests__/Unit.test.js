// src/models/__tests__/Unit.test.js
import Unit from '../Unit';

describe('Unit model', () => {
  it('correctly initializes core stats and cost', () => {
    const data = {
      id: 10,
      type: 'Soldier',
      tier: 1,
      faction: 'Standard',
      hp: 1,
      specialRange: 0,
      range: 0,
      rangedRoll: '',            // melee-only
      offensiveRoll: '1 for 2',
      defensiveRoll: '1 for 3',
      cost: {
        gold:       0,
        food:       0,
        wood:       2,
        metal:      0,
        crystal:    0,
        population: 1
      }
    };

    const u = new Unit(data);

    expect(u.id).toBe(10);
    expect(u.type).toBe('Soldier');
    expect(u.tier).toBe(1);
    expect(u.hp).toBe(1);
    expect(u.offensiveRoll).toEqual({ rolls: 1, threshold: 2 });
    expect(u.defensiveRoll).toEqual({ rolls: 1, threshold: 3 });
    expect(u.rangedRoll).toBeNull();
    expect(u.cost).toMatchObject({ wood: 2, population: 1, gold: 0 });
  });

  it('parseRoll returns null for invalid or empty strings', () => {
    expect(Unit.parseRoll('')).toBeNull();
    expect(Unit.parseRoll(null)).toBeNull();
    expect(Unit.parseRoll('no match here')).toBeNull();
  });

  it('parseRoll handles uppercase/lowercase and spaces', () => {
    expect(Unit.parseRoll('  2   for 5 ')).toEqual({ rolls: 2, threshold: 5 });
    expect(Unit.parseRoll('3 FOR 4')).toEqual({ rolls: 3, threshold: 4 });
  });
});

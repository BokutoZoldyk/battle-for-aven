// src/models/Game.js
import { allUnits } from '../data/initialUnits';
import { allSettlements } from '../data/initialSettlements';

export default class Game {
  constructor({ players = 4 } = {}) {
    this.players     = players;
    this.units        = [...allUnits];        // clone if you plan on mutating
    this.settlements  = [...allSettlements];
    // you can also partition units/settlements by faction/player here
  }

  // stub: deal starting units/settlements to each player
  dealStartingAssets() {
    // e.g. give each player one city + a soldier and archer
    // this is where you’d mutate this.units/this.settlements
  }

  // stub: check win conditions
  checkWin() {
    // return winner or null
  }

  // stub: advance a turn (build/combat/diplo)
  nextTurn() {
    // apply RuleBook rules...
  }
}

const GameEngine = require('./GameEngine');
const { SimpleAI, STRATEGIES } = require('../AI/SimpleAI');

const engine = new GameEngine({ players: 2, rows: 5, cols: 5 });
const ai1 = new SimpleAI(0, STRATEGIES.AGGRESSIVE);
const ai2 = new SimpleAI(1, STRATEGIES.AGGRESSIVE);

for (let i = 0; i < 3; i++) {
  ai1.takeTurn(engine);
  ai2.takeTurn(engine);
  engine.nextTurn();
}

console.log(JSON.stringify(engine, null, 2));

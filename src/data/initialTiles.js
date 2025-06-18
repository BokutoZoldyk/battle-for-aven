// generate an empty rows×cols grid
export function makeInitialTiles(rows = 10, cols = 10) {
  const terrains = ['plains', 'caves', 'farmland', 'forest', 'mountain', 'water'];
  const tiles = [];
  for (let r = 0; r < rows; r++) {
    const row = [];
    for (let c = 0; c < cols; c++) {
      const terrain = terrains[Math.floor(Math.random() * terrains.length)];
      row.push({ row: r, col: c, terrain, unit: null });
    }
    tiles.push(row);
  }
  return tiles;
}


// generate an empty rows×cols grid
export function makeInitialTiles(rows = 10, cols = 10) {
  const tiles = [];
  for (let r = 0; r < rows; r++) {
    const row = [];
    for (let c = 0; c < cols; c++) {
      row.push({ row: r, col: c, terrain: 'plains',  unit: null });
    }
    tiles.push(row);
  }
  return tiles;
}

// a simple JS class for later game logic
export default class Tile {
  constructor(row, col, terrain = 'plains', unit = null) {
    this.row = row
    this.col = col
    this.terrain = terrain
    this.unit = unit
  }
}

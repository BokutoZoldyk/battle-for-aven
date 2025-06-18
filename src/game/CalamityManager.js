// src/game/CalamityManager.js

export default class CalamityManager {
  /**
   * @param {Game} game  The core Game instance, with a `.tiles` array.
   */
  constructor(game) {
    this.game = game;
    this.activeCalamities = [];
  }

  /**
   * Spawn initial calamities once at game start.
   * Currently a no-op stub to avoid runtime errors.
   *
   * @param {number} playerCount
   */
  spawnInitial(playerCount) {
    // guard against missing tiles
    if (!this.game || !Array.isArray(this.game.tiles)) {
      console.warn('CalamityManager: no tiles to spawn on');
      return;
    }

    // stub: you can loop playerCount times and pick tiles via _pickSpawnTile()
    // for now we do nothing, to avoid errors.
  }

  /**
   * Example helper: pick a random tile away from any HQ.
   * You can flesh this out later.
   */
  _pickSpawnTile(minDistance = 3) {
    const { tiles, settlements } = this.game;
    if (!Array.isArray(tiles) || !Array.isArray(settlements)) return null;

    // find all HQ positions
    const hqTiles = settlements
      .filter(s => s.type === 'City' && s.tile)
      .map(s => `${s.tile.row},${s.tile.col}`);

    // filter tiles at least `minDistance` away (Manhattan as example)
    const candidates = tiles.filter(t => {
      return !hqTiles.some(key => {
        const [r, c] = key.split(',').map(Number);
        return Math.abs(r - t.row) + Math.abs(c - t.col) < minDistance;
      });
    });

    if (candidates.length === 0) return null;
    return candidates[Math.floor(Math.random() * candidates.length)];
  }
}

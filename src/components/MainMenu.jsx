export default function MainMenu({ onSinglePlayer, onMultiplayer, onRules }) {
  return (
    <div className="home">
      <h1>BATTLE FOR AVEN</h1>
      <div className="menu-group">
        <button onClick={onSinglePlayer}>Single Player</button>
        <button onClick={onMultiplayer}>Multiplayer</button>
        <button onClick={onRules}>Rules</button>
      </div>
    </div>
  );
}
import SinglePlayerBanner from '../data/pictures/SinglePlayerBanner.png';
console.log(SinglePlayerBanner);


export default function MainMenu({ onSinglePlayer, onMultiplayer, onRules }) {
  return (
    <div className="home">
      <h1>BATTLE FOR AVEN</h1>
      <div className="menu-group">
        <button onClick={onSinglePlayer}style={{
            padding: 0,
            border: 'none',
      }}>
          

            <
              img src={SinglePlayerBanner}
              alt="Single Player Banner" 
              style = {{ width: '70%', height: 'auto' }}

              
              /> 
        </button>
        <button onClick={onMultiplayer}>Multiplayer</button>
        <button onClick={onRules}>Rules</button>
      </div>
    </div>
  );
}
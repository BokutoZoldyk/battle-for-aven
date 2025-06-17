import React from 'react';

export default function HomePage({ onStartGame }) {
  return (
    <div className="home">
      <h1>BATTLE FOR AVEN</h1>

      <div className="menu-group">
        <h2>PLAY</h2>
        <button onClick={() => onStartGame(4, 10)}>4 PLAYER 10×10</button>
        <button onClick={() => onStartGame(5, 12)}>5 PLAYER 12×12</button>
        <button onClick={() => onStartGame(6, 14)}>6 PLAYER 14×14</button>
      </div>

      <div className="menu-group">
        <h2>HOW TO PLAY</h2>
        <button disabled>RULES</button>
      </div>
    </div>
  );
}

import React from 'react';
import RouletteGame from './RouletteGame'; // Zakładam, że plik to RouletteGame.jsx
import './App.css'; // jeśli używasz własnych stylów globalnych

function App() {
  return (
    <div className="App">
      <RouletteGame onBalanceChange={onBalanceChange}/>
    </div>
  );
}

const onBalanceChange = (balance) => {
  alert('zaktualizowano balans')
}

export default App;

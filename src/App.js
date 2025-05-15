import React from 'react';
import RouletteGame from './components/RouletteGame'; 
import './App.css'; 

function App() {
  return (
    <div className="App">
      <RouletteGame onBalanceChange={onBalanceChange}/>
    </div>
  );
}

//wywołanie api backendu, przesłanie nowego balansu
const onBalanceChange = (balance) => {
  alert('zaktualizowano balans')
}


export default App;

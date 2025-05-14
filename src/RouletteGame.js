import React, { useState } from 'react';
import Roulette from './Roulette';

const RouletteGame = ({initialBalance = 1000, onBalanceChange}) => {
  const [balance, setBalance] = useState(initialBalance);
  const [betColor, setBetColor] = useState('red');
  const [betAmount, setBetAmount] = useState(100);
  const [lastResult, setLastResult] = useState(null);
  const [message, setMessage] = useState('');
  const [canSpin, setCanSpin] = useState(true);

  const handleBet = () => {
  if (betAmount <= 0 || betAmount > balance) {
    setMessage('Nieprawidłowa kwota zakładu.');
    return false;
  }

  setMessage('');
  setCanSpin(false);
  return true;
  };

  const handleSpinEnd = (result) => {
    setLastResult(result);
    const win =
      result.color === betColor ||
      (betColor === 'green' && result.number === '0');

    let payout = 0;

    if (win) {
      payout = result.color === 'green' ? betAmount * 14 : betAmount * 2;
      
      setBalance((prev) => {
        const newBalance = prev + payout;
        if(onBalanceChange) onBalanceChange(newBalance);
        return newBalance;
      });

      setMessage(`Wygrana! ${result.number} (${result.color}) → +${payout} żetonów`);
    } else {
      
      setBalance((prev) => {
        const newBalance = prev + payout;
        if(onBalanceChange) onBalanceChange(newBalance);
        return newBalance;
      });

      setBalance((prev) => prev - betAmount);
      setMessage(`Przegrana! ${result.number} (${result.color}) → -${betAmount} żetonów`);
    }

    setCanSpin(true); // ponowne zakręcenie możliwe
  };

  return (
    <div style={{ textAlign: 'center', maxWidth: '500px', margin: '0 auto', fontFamily: 'Arial' }}>
      <h2>🎰 Ruletka</h2>
      <p>Saldo: <strong>{balance} żetonów</strong></p>

      <div style={{ marginBottom: '1rem' }}>
        <label>Kolor:&nbsp;
          <select value={betColor} onChange={(e) => setBetColor(e.target.value)} disabled={!canSpin}>
            <option value="red">Czerwony</option>
            <option value="black">Czarny</option>
            <option value="green">Zielony (0)</option>
          </select>
        </label>
        <br />
        <label>Zakład:&nbsp;
          <input
            type="number"
            value={betAmount}
            min="1"
            max={balance}
            onChange={(e) => setBetAmount(Number(e.target.value))}
            disabled={!canSpin}
          />
        </label>
      </div>

      <Roulette
        onSpinEnd={handleSpinEnd}
        baseSize={350}
        spinRequest={canSpin ? handleBet : null}
      />

      {lastResult && (
        <div style={{ marginTop: '1rem' }}>
          Ostatni wynik: <strong>{lastResult.number}</strong> ({lastResult.color})
        </div>
      )}

      {message && (
        <div style={{ marginTop: '0.5rem', fontWeight: 'bold' }}>{message}</div>
      )}
    </div>
  );
};


export default RouletteGame;

import React, { useState } from 'react';
import Roulette from './Roulette';
import BetPanel from './BetPanel';
import './RouletteGame.css';

const RouletteGame = ({ initialBalance = 1000, onBalanceChange }) => {
  const [balance, setBalance] = useState(initialBalance);
  const [betAmount, setBetAmount] = useState(100);
  const [selectedBet, setSelectedBet] = useState(null);
  const [lastResult, setLastResult] = useState(null);
  const [message, setMessage] = useState('');
  const [canSpin, setCanSpin] = useState(true);

  const handleBet = () => {
    if (!selectedBet) {
      setMessage('Wybierz zakład.');
      return false;
    }

    if (betAmount <= 0 || betAmount > balance) {
      setMessage('Nieprawidłowa kwota zakładu.');
      return false;
    }

    setMessage('');
    setCanSpin(false);
    setBalance((prev) => prev - betAmount);
    return true;
  };

  const handleSpinEnd = (result) => {
    setLastResult(result);

    let win = false;
    const resultNumber = parseInt(result.number);
    const resultColor = result.color;

    // 🧠 Sprawdź wynik zakładu
    switch (selectedBet.type) {
      case 'number':
        win = resultNumber === selectedBet.value;
        break;
      case 'color':
        win = resultColor === selectedBet.value;
        break;
      case 'parity':
        if (resultNumber === 0) win = false;
        else win = (resultNumber % 2 === 0 && selectedBet.value === 'even') || (resultNumber % 2 !== 0 && selectedBet.value === 'odd');
        break;
      case 'dozen':
        const range = selectedBet.value.split('-').map(Number);
        win = resultNumber >= range[0] && resultNumber <= range[1];
        break;
      default:
        break;
    }

    let payout = 0;
    if (win) {
      switch (selectedBet.type) {
        case 'number':
          payout = betAmount * 36;
          break;
        case 'color':
        case 'parity':
          payout = betAmount * 2;
          break;
        case 'dozen':
          payout = betAmount * 3;
          break;
      }

      setBalance((prev) => {
        const newBalance = prev + payout;
        if (onBalanceChange) onBalanceChange(newBalance);
        return newBalance;
      });

      setMessage(`✅ Wygrana! ${result.number} (${result.color}) → +${payout} żetonów`);
    } else {
      setMessage(`❌ Przegrana! ${result.number} (${result.color}) → -${betAmount} żetonów`);
    }

    setCanSpin(true);
  };

  return (
    <div className="roulette-game-layout">
      <div className="roulette-left">
        <Roulette
          onSpinEnd={handleSpinEnd}
          baseSize={400}
          spinRequest={canSpin ? handleBet : null}
        />
      </div>

      <div className="roulette-right">
        <div className="roulette-bet-panel">
          <BetPanel
            onBetSelect={setSelectedBet}
            selectedBet={selectedBet}
          />
          <label>
            Kwota zakładu:&nbsp;
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

        <div className="roulette-info-panel">
          <p><strong>Saldo:</strong> {balance} żetonów</p>
          {lastResult && (
            <p><strong>Ostatni wynik:</strong> {lastResult.number} ({lastResult.color})</p>
          )}
          {message && <p><strong>{message}</strong></p>}
        </div>
      </div>
    </div>
  );
};
export default RouletteGame;

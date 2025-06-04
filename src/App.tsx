import { useState, useEffect } from 'react'
import Field from './assets/components/playingField'
import FirstPlayer from './assets/components/firstPlayer'
import SecondPlayer from './assets/components/secondPlayer'
import './App.css'

function App() {
  const [squares, setSquares] = useState<(string | null)[]>(Array(9).fill(null));
  const [currentPlayer, setCurrentPlayer] = useState<'X' | 'O'>('X');
  const [winsX, setWinsX] = useState(0);
  const [winsO, setWinsO] = useState(0);
  const [timeX, setTimeX] = useState(0);
  const [timeO, setTimeO] = useState(0);
  const [gameActive, setGameActive] = useState(true);
  const [winner, setWinner] = useState<'X' | 'O' | 'Draw' | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [totalGames, setTotalGames] = useState(0);
  const [gridSize, setGridSize] = useState(3);
  const [pendingGridSize, setPendingGridSize] = useState(3);
  const [totalGameTime, setTotalGameTime] = useState(0);

  useEffect(() => {
    if (!gameActive) return;
    const interval = setInterval(() => {
      if (currentPlayer === 'X') setTimeX(t => t + 1);
      else setTimeO(t => t + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [currentPlayer, gameActive]);

  useEffect(() => {
    if (!gameActive) return;
    const interval = setInterval(() => {
      setTotalGameTime(t => t + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [gameActive]);

  function calculateWinner(squares: (string | null)[], gridSize: number): 'X' | 'O' | null {
    for (let row = 0; row < gridSize; row++) {
      const first = squares[row * gridSize];
      if (first === null) continue;

      let win = true;
      for (let col = 1; col < gridSize; col++) {
        if (squares[row * gridSize + col] !== first) {
          win = false;
          break;
        }
      }
      if (win) return first as 'X' | 'O';
    }
    for (let col = 0; col < gridSize; col++) {
      const first = squares[col];
      if (first === null) continue;

      let win = true;
      for (let row = 1; row < gridSize; row++) {
        if (squares[row * gridSize + col] !== first) {
          win = false;
          break;
        }
      }
      if (win) return first as 'X' | 'O';
    }
    const firstMainDiag = squares[0];
    if (firstMainDiag !== null) {
      let win = true;
      for (let i = 1; i < gridSize; i++) {
        if (squares[i * gridSize + i] !== firstMainDiag) {
          win = false;
          break;
        }
      }
      if (win) return firstMainDiag as 'X' | 'O';
    }
    const firstAntiDiag = squares[gridSize - 1];
    if (firstAntiDiag !== null) {
      let win = true;
      for (let i = 1; i < gridSize; i++) {
        if (squares[i * gridSize + (gridSize - 1 - i)] !== firstAntiDiag) {
          win = false;
          break;
        }
      }
      if (win) return firstAntiDiag as 'X' | 'O';
    }
    return null;
  }

  function handleClick(index: number) {
    if (!gameActive || squares[index]) return;

    const newSquares = [...squares];
    newSquares[index] = currentPlayer;
    setSquares(newSquares);

    const result = calculateWinner(newSquares, gridSize);
    if (result) {
      setGameActive(false);
      setWinner(result);
      if (result === 'X') setWinsX(prev => prev + 1);
      else setWinsO(prev => prev + 1);
      return;
    }

    if (!newSquares.includes(null)) {
      setGameActive(false);
      setWinner('Draw');
      return;
    }

    setCurrentPlayer(prev => (prev === 'X' ? 'O' : 'X'));
  }

  function startNewGame() {
    setGridSize(pendingGridSize);
    setSquares(Array(pendingGridSize * pendingGridSize).fill(null));
    setTimeX(0);
    setTimeO(0);
    setWinner(null);
    setGameActive(true);
    setCurrentPlayer('X');
    setTotalGameTime(0);
  }

  function handleNextRound() {
    setTimeX(0);
    setTimeO(0);
    setWinner(null);
    setGameActive(false);
    setCurrentPlayer('X');
    setShowModal(false);
    setTotalGameTime(0);
    setTotalGames(t => t + 1);
  }

  function handleGridSizeChange(e: React.ChangeEvent<HTMLSelectElement>) {
    setPendingGridSize(Number(e.target.value));
  }

  useEffect(() => {
    if (winner) setTimeout(() => setShowModal(true), 2000);
  }, [winner]);

  return (
    <>
      <select value={gridSize} onChange={handleGridSizeChange} style={{
        backgroundColor: 'white',
        width: '20%',
        textAlign: 'center',
        fontSize: '1.5rem'
      }}>
        {[3, 4, 5, 6, 7, 8, 9].map(n => (
          <option key={n} value={n}>
            {n} x {n}
          </option>
        ))}
      </select>
      <section className="players">
        <FirstPlayer wins={winsX} time={timeX} active={currentPlayer === 'X'} />
        <p className={currentPlayer === 'X' ? 'first' : 'second'}>
          {currentPlayer === 'X' ? "First player's turn" : "Second player's turn"}
        </p>
        <p className="players__totalGames">Total games: {totalGames}</p>
        <SecondPlayer wins={winsO} time={timeO} active={currentPlayer === 'O'} />
      </section>
      <hr />
      <section className="field">
        <Field squares={squares} onClick={handleClick} gridSize={gridSize} />
        <button onClick={startNewGame}>Start new game</button>
      </section>

      {showModal && (
        <div className="modal" onClick={handleNextRound}>
          <div className="modal__content" onClick={e => e.stopPropagation()}>
            <h2>
              {winner === 'Draw'
                ? `Draw! The round was over in ${totalGameTime} seconds`
                : `${winner === 'X' ? 'First' : 'Second'} player wins! The round was over in ${totalGameTime} seconds`}
            </h2>
            <button onClick={handleNextRound}>Ок</button>
          </div>
        </div>
      )}
    </>
  );
}

export default App;

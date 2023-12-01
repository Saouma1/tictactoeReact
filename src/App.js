import { useState } from 'react';
import './App.css';

function Square({ value, onSquareClick, highlight }) {
  const className = `square ${highlight ? 'highlight' : ''}`;
  return (
    <button className={className} onClick={onSquareClick}>
      {value}
    </button>
  );
}

function Board({ xIsNext, squares, onPlay }) {
  const winInfo = calculateWinner(squares);
  let winner = null;
  let winningSquares = [];
  if (winInfo) {
    winner = winInfo.winner;
    winningSquares = winInfo.winningLine;
  }

  function handleClick(i) {
    if (winner || squares[i]) {
      return;
    }
    const nextSquares = squares.slice();
    nextSquares[i] = xIsNext ? 'X' : 'O';
    onPlay(nextSquares, i);
  }

  let status;
  if (winner) {
    status = `Winner: ${winner} 🌟🌟🌟🌟🌟`;
  } else if (squares.every(square => square !== null)) {
    status = 'Draw!';
  } else {
    status = 'Next player: ' + (xIsNext ? 'X' : 'O');
  }

  // Creating 3x3 board using two loops
  const size = 3;
  const board = [];
  for (let row = 0; row < size; row++) {
    const currentRow = [];
    for (let col = 0; col < size; col++) {
      const index = row * size + col;
      currentRow.push(
        <Square
          key={index}
          value={squares[index]}
          onSquareClick={() => handleClick(index)}
          highlight={winningSquares.includes(index)}
        />
      );
    }
    board.push(<div key={row} className="board-row">{currentRow}</div>);
  }

  return (
    <>
      <div className="status">{status}</div>
      {board}
    </>
  );
}

export default function Game() {
  const [history, setHistory] = useState([{ squares: Array(9).fill(null), location: null }]);
  const [currentMove, setCurrentMove] = useState(0);
  const xIsNext = currentMove % 2 === 0;
  const current = history[currentMove];

  function handlePlay(nextSquares, moveIndex) {
    const row = Math.floor(moveIndex / 3);
    const col = moveIndex % 3;
    const nextHistory = history.slice(0, currentMove + 1).concat([{ squares: nextSquares, location: `(${row}, ${col})` }]);
    setHistory(nextHistory);
    setCurrentMove(nextHistory.length - 1);
  }

  function jumpTo(nextMove) {
    setCurrentMove(nextMove);
  }

  const moves = history.map((step, move) => {
    const desc = move ?
      'Go to move #' + move + ' at ' + step.location :
      'Start of game';
    return (
      <li key={move}>
        <button onClick={() => jumpTo(move)}>{desc}</button>
      </li>
    );
  });

  return (
    <div className="game">
      <div className="game-board">
        <Board xIsNext={xIsNext} squares={current.squares} onPlay={handlePlay} />
      </div>
      <div className="game-info">
        <ol>{moves}</ol>
      </div>
    </div>
  );
}

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return { winner: squares[a], winningLine: lines[i] };
    }
  }
  return null;
}

export type Player = 'X' | 'O';
export type CellValue = Player | null;
export type BoardState = CellValue[];

export interface WinResult {
  winner: Player | null;
  winningLine: number[] | null;
  isDraw: boolean;
}

export const WINNING_LINES = [
  [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
  [0, 3, 6], [1, 4, 7], [2, 5, 8], // Cols
  [0, 4, 8], [2, 4, 6]             // Diagonals
];

export const createBoard = (): BoardState => {
  return Array(9).fill(null);
};

export const makeMove = (board: BoardState, index: number, player: Player): BoardState => {
  if (board[index] !== null) {
    throw new Error('Cell is already occupied');
  }
  const newBoard = [...board];
  newBoard[index] = player;
  return newBoard;
};

export const checkWin = (board: BoardState): WinResult => {
  for (const line of WINNING_LINES) {
    const [a, b, c] = line;
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      return { winner: board[a] as Player, winningLine: line, isDraw: false };
    }
  }

  if (!board.includes(null)) {
    return { winner: null, winningLine: null, isDraw: true };
  }

  return { winner: null, winningLine: null, isDraw: false };
};

export const checkDraw = (board: BoardState): boolean => {
  return !board.includes(null) && !checkWin(board).winner;
};

// Minimax Algorithm
const scores = {
  X: 10,
  O: -10,
  TIE: 0
};

// Assuming CPU is always maximizing its own score. 
// We need to know which symbol the CPU is playing as.
// Standard Minimax: 
// If CPU is 'O', it wants to minimize score (if 'O' is -10).
// If CPU is 'X', it wants to maximize score (if 'X' is 10).
// Let's make it generic: Maximize for 'maximizingPlayer'.

export const minimax = (board: BoardState, depth: number, isMaximizing: boolean, cpuSymbol: Player, humanSymbol: Player): number => {
  const result = checkWin(board);
  if (result.winner === cpuSymbol) return 10 - depth;
  if (result.winner === humanSymbol) return depth - 10;
  if (result.isDraw) return 0;

  if (isMaximizing) {
    let bestScore = -Infinity;
    for (let i = 0; i < 9; i++) {
      if (board[i] === null) {
        board[i] = cpuSymbol;
        const score = minimax(board, depth + 1, false, cpuSymbol, humanSymbol);
        board[i] = null;
        bestScore = Math.max(score, bestScore);
      }
    }
    return bestScore;
  } else {
    let bestScore = Infinity;
    for (let i = 0; i < 9; i++) {
      if (board[i] === null) {
        board[i] = humanSymbol;
        const score = minimax(board, depth + 1, true, cpuSymbol, humanSymbol);
        board[i] = null;
        bestScore = Math.min(score, bestScore);
      }
    }
    return bestScore;
  }
};

export const getBestMove = (board: BoardState, cpuSymbol: Player): number => {
  const humanSymbol = cpuSymbol === 'X' ? 'O' : 'X';
  let bestScore = -Infinity;
  let move = -1;

  // If it's the very first move of the game, pick center or a corner for efficiency/variety
  // though minimax is fast enough for 3x3.
  // Optimization: If board is empty, pick center (4).
  if (board.every(cell => cell === null)) return 4;

  // Create a copy of the board to avoid mutating the actual game state
  const boardCopy = [...board];

  for (let i = 0; i < 9; i++) {
    if (boardCopy[i] === null) {
      boardCopy[i] = cpuSymbol;
      const score = minimax(boardCopy, 0, false, cpuSymbol, humanSymbol);
      boardCopy[i] = null;
      if (score > bestScore) {
        bestScore = score;
        move = i;
      }
    }
  }
  return move;
};

export const getRandomMove = (board: BoardState): number => {
  const availableMoves = board.map((val, idx) => val === null ? idx : null).filter(val => val !== null) as number[];
  if (availableMoves.length === 0) return -1;
  const randomIndex = Math.floor(Math.random() * availableMoves.length);
  return availableMoves[randomIndex];
};

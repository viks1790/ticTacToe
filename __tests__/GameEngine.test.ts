import { createBoard, makeMove, checkWin, checkDraw, getBestMove, BoardState, Player } from '../src/services/GameEngine';

describe('GameEngine', () => {
  it('should create an empty board', () => {
    const board = createBoard();
    expect(board).toHaveLength(9);
    expect(board.every(cell => cell === null)).toBe(true);
  });

  it('should make a move correctly', () => {
    let board = createBoard();
    board = makeMove(board, 0, 'X');
    expect(board[0]).toBe('X');
  });

  it('should detect a row win', () => {
    const board: BoardState = [
      'X', 'X', 'X',
      null, null, null,
      null, null, null
    ];
    const result = checkWin(board);
    expect(result.winner).toBe('X');
    expect(result.winningLine).toEqual([0, 1, 2]);
  });

  it('should detect a column win', () => {
    const board: BoardState = [
      'O', null, null,
      'O', null, null,
      'O', null, null
    ];
    const result = checkWin(board);
    expect(result.winner).toBe('O');
    expect(result.winningLine).toEqual([0, 3, 6]);
  });

  it('should detect a diagonal win', () => {
    const board: BoardState = [
      'X', null, null,
      null, 'X', null,
      null, null, 'X'
    ];
    const result = checkWin(board);
    expect(result.winner).toBe('X');
    expect(result.winningLine).toEqual([0, 4, 8]);
  });

  it('should detect a draw', () => {
    const board: BoardState = [
      'X', 'O', 'X',
      'X', 'O', 'O',
      'O', 'X', 'X'
    ];
    const result = checkWin(board);
    expect(result.winner).toBeNull();
    expect(result.isDraw).toBe(true);
    expect(checkDraw(board)).toBe(true);
  });

  it('should prevent overwriting a cell', () => {
    const board: BoardState = ['X', null, null, null, null, null, null, null, null];
    expect(() => makeMove(board, 0, 'O')).toThrow('Cell is already occupied');
  });

  describe('Minimax / Hard AI', () => {
    it('should block an immediate threat', () => {
      // X has two in a row, O (CPU) should block
      const board: BoardState = [
        'X', 'X', null,
        null, 'O', null,
        null, null, null
      ];
      // CPU is 'O'
      const bestMove = getBestMove(board, 'O');
      expect(bestMove).toBe(2);
    });

    it('should take the winning move', () => {
      // O has two in a row, O (CPU) should win
      const board: BoardState = [
        'O', 'O', null,
        'X', 'X', null,
        null, null, null
      ];
      const bestMove = getBestMove(board, 'O');
      expect(bestMove).toBe(2);
    });

    it('should not lose against optimal play (sanity check)', () => {
      // Empty board, CPU 'O' (second player usually, but here testing logic)
      // If CPU starts, it usually picks center or corner.
      const board = createBoard();
      const move = getBestMove(board, 'X');
      expect(move).toBeDefined();
      // Center is usually best
      expect(move).toBe(4);
    });
  });
});

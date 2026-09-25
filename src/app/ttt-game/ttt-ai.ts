/**
 * Tic Tac Toe engine + AI.
 *
 * The AI uses minimax with alpha-beta pruning. Scores are depth-adjusted so the
 * AI prefers the fastest win and the slowest loss. Lower difficulties blend in
 * heuristic / random moves so the game stays winnable for humans.
 */

export type Cell = 'X' | 'O' | null;
export type Difficulty = 'easy' | 'medium' | 'hard' | 'impossible';

export const WIN_LINES: number[][] = [
  [0, 1, 2], [3, 4, 5], [6, 7, 8], // rows
  [0, 3, 6], [1, 4, 7], [2, 5, 8], // columns
  [0, 4, 8], [2, 4, 6]             // diagonals
];

export interface GameResult {
  winner: Cell | 'draw';
  line: number[];
}

export function emptyCells(board: Cell[]): number[] {
  const cells: number[] = [];
  board.forEach((c, i) => { if (c === null) { cells.push(i); } });
  return cells;
}

/** Returns the result if the game is over, otherwise null. */
export function evaluateBoard(board: Cell[]): GameResult | null {
  for (const line of WIN_LINES) {
    const [a, b, c] = line;
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      return { winner: board[a], line };
    }
  }
  return board.every(c => c !== null) ? { winner: 'draw', line: [] } : null;
}

function other(p: 'X' | 'O'): 'X' | 'O' {
  return p === 'X' ? 'O' : 'X';
}

function pickRandom<T>(items: T[]): T {
  return items[Math.floor(Math.random() * items.length)];
}

/** Finds a move that immediately completes a line for `player`, or -1. */
export function findWinningMove(board: Cell[], player: 'X' | 'O'): number {
  for (const i of emptyCells(board)) {
    board[i] = player;
    const won = evaluateBoard(board);
    board[i] = null;
    if (won && won.winner === player) { return i; }
  }
  return -1;
}

function minimax(board: Cell[], toMove: 'X' | 'O', ai: 'X' | 'O',
                 depth: number, alpha: number, beta: number): number {
  const result = evaluateBoard(board);
  if (result) {
    if (result.winner === 'draw') { return 0; }
    return result.winner === ai ? 10 - depth : depth - 10;
  }
  const maximizing = toMove === ai;
  let best = maximizing ? -Infinity : Infinity;
  for (const i of emptyCells(board)) {
    board[i] = toMove;
    const score = minimax(board, other(toMove), ai, depth + 1, alpha, beta);
    board[i] = null;
    if (maximizing) {
      best = Math.max(best, score);
      alpha = Math.max(alpha, best);
    } else {
      best = Math.min(best, score);
      beta = Math.min(beta, best);
    }
    if (beta <= alpha) { break; }
  }
  return best;
}

/** All moves that share the optimal minimax score (randomised for variety). */
export function bestMoves(board: Cell[], ai: 'X' | 'O'): number[] {
  const cells = emptyCells(board);
  // An empty board is a well-known draw; skip the full search and pick a strong opening.
  if (cells.length === 9) { return [0, 2, 4, 6, 8]; }
  let bestScore = -Infinity;
  let moves: number[] = [];
  for (const i of cells) {
    board[i] = ai;
    const score = minimax(board, other(ai), ai, 1, -Infinity, Infinity);
    board[i] = null;
    if (score > bestScore) {
      bestScore = score;
      moves = [i];
    } else if (score === bestScore) {
      moves.push(i);
    }
  }
  return moves;
}

/** Simple rule-based play: win, block, centre, corner, side. */
function heuristicMove(board: Cell[], ai: 'X' | 'O'): number {
  const win = findWinningMove(board, ai);
  if (win !== -1) { return win; }
  const block = findWinningMove(board, other(ai));
  if (block !== -1) { return block; }
  if (board[4] === null) { return 4; }
  const corners = [0, 2, 6, 8].filter(i => board[i] === null);
  if (corners.length) { return pickRandom(corners); }
  return pickRandom(emptyCells(board));
}

/**
 * Chooses the AI's move for the given difficulty.
 *  - easy:       takes an obvious win sometimes, otherwise random
 *  - medium:     wins/blocks reliably, otherwise heuristic or random
 *  - hard:       optimal 85% of the time, heuristic otherwise
 *  - impossible: always optimal (cannot be beaten)
 */
export function chooseAiMove(board: Cell[], ai: 'X' | 'O', difficulty: Difficulty): number {
  const b = board.slice();
  const cells = emptyCells(b);
  if (!cells.length) { return -1; }

  switch (difficulty) {
    case 'easy': {
      const win = findWinningMove(b, ai);
      if (win !== -1 && Math.random() < 0.5) { return win; }
      return pickRandom(cells);
    }
    case 'medium': {
      const win = findWinningMove(b, ai);
      if (win !== -1) { return win; }
      const block = findWinningMove(b, other(ai));
      if (block !== -1) { return block; }
      return Math.random() < 0.5 ? heuristicMove(b, ai) : pickRandom(cells);
    }
    case 'hard':
      return Math.random() < 0.85 ? pickRandom(bestMoves(b, ai)) : heuristicMove(b, ai);
    case 'impossible':
    default:
      return pickRandom(bestMoves(b, ai));
  }
}

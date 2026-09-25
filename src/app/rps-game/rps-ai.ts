/**
 * Rock Paper Scissors AI.
 *
 * Humans are bad at being random: they repeat winning moves, switch after a
 * loss and fall into short patterns. The adaptive AI keeps several predictors
 * (overall frequency, what the player did after their last move, after their
 * last two moves, and after a win/loss/tie) and scores each one on how well it
 * would have predicted past rounds. It follows the currently best-performing
 * predictor and plays the move that beats the prediction.
 */

export type Move = 0 | 1 | 2; // 0 rock, 1 paper, 2 scissors
export type Outcome = 'win' | 'lose' | 'tie'; // from the human's point of view
export type RpsDifficulty = 'random' | 'adaptive' | 'master';

export const MOVE_NAMES = ['Rock', 'Paper', 'Scissors'];

export interface Round {
  human: Move;
  ai: Move;
  outcome: Outcome;
}

/** The move that beats `m`. */
export function beats(m: Move): Move {
  return ((m + 1) % 3) as Move;
}

export function judge(human: Move, ai: Move): Outcome {
  if (human === ai) { return 'tie'; }
  return (human - ai + 3) % 3 === 1 ? 'win' : 'lose';
}

function randomMove(): Move {
  return Math.floor(Math.random() * 3) as Move;
}

function argmax(counts: number[]): Move | null {
  const max = Math.max(...counts);
  if (max <= 0) { return null; }
  const best = counts.map((c, i) => c === max ? i : -1).filter(i => i >= 0);
  return best[Math.floor(Math.random() * best.length)] as Move;
}

type Predictor = (history: Round[]) => Move | null;

/** Most frequent move overall (recent rounds weighted higher). */
const frequencyPredictor: Predictor = (history) => {
  const counts = [0, 0, 0];
  history.forEach((r, i) => counts[r.human] += 1 + i / history.length);
  return argmax(counts);
};

/** Builds a predictor keyed by some context of the previous round(s). */
function contextPredictor(order: number, keyOf: (rounds: Round[]) => string): Predictor {
  return (history) => {
    if (history.length <= order) { return null; }
    const table: { [key: string]: number[] } = {};
    for (let i = order; i < history.length; i++) {
      const key = keyOf(history.slice(i - order, i));
      table[key] = table[key] || [0, 0, 0];
      table[key][history[i].human] += 1;
    }
    const current = keyOf(history.slice(history.length - order));
    return table[current] ? argmax(table[current]) : null;
  };
}

const PREDICTORS: Predictor[] = [
  frequencyPredictor,
  // What does the player do after playing X?
  contextPredictor(1, r => `${r[0].human}`),
  // ...after playing X then Y?
  contextPredictor(2, r => `${r[0].human}${r[1].human}`),
  // ...after winning / losing / tying with X? (win-stay, lose-shift)
  contextPredictor(1, r => `${r[0].human}${r[0].outcome}`),
  // ...after the full previous round (both moves)?
  contextPredictor(1, r => `${r[0].human}${r[0].ai}`)
];

export interface AiDecision {
  move: Move;
  predicted: Move | null;  // what the AI expects the human to play
  confidence: number;      // 0..1, how reliable the chosen predictor has been
}

/**
 * Decides the AI's next move from the round history.
 */
export function chooseRpsMove(history: Round[], difficulty: RpsDifficulty): AiDecision {
  if (difficulty === 'random' || history.length < 2) {
    return { move: randomMove(), predicted: null, confidence: 0 };
  }

  // Score every predictor on how it would have done on recent rounds.
  const window = difficulty === 'master' ? 30 : 12;
  const start = Math.max(1, history.length - window);
  const scores = PREDICTORS.map(() => 0);
  const attempts = PREDICTORS.map(() => 0);
  for (let t = start; t < history.length; t++) {
    const past = history.slice(0, t);
    PREDICTORS.forEach((p, idx) => {
      const guess = p(past);
      if (guess === null) { return; }
      attempts[idx]++;
      scores[idx] += guess === history[t].human ? 1 : (beats(guess) === history[t].human ? -1 : 0);
    });
  }

  let bestIdx = -1;
  let bestScore = -Infinity;
  scores.forEach((s, i) => {
    if (attempts[i] > 0 && s > bestScore) { bestScore = s; bestIdx = i; }
  });

  const predicted = bestIdx >= 0 ? PREDICTORS[bestIdx](history) : null;
  const confidence = bestIdx >= 0 ? Math.max(0, bestScore) / attempts[bestIdx] : 0;

  // No usable signal -> stay unpredictable ourselves.
  if (predicted === null || bestScore <= 0) {
    return { move: randomMove(), predicted, confidence: 0 };
  }

  // Adaptive mode leaves some room for the human; master rarely does.
  const noise = difficulty === 'master' ? 0.05 : 0.3;
  const move = Math.random() < noise ? randomMove() : beats(predicted);
  return { move, predicted, confidence };
}

import { Component, OnDestroy } from '@angular/core';
import { Cell, Difficulty, chooseAiMove, evaluateBoard } from './ttt-ai';

type Status = 'human' | 'ai' | 'over';

@Component({
  selector: 'app-ttt-game',
  templateUrl: './ttt-game.component.html',
  styleUrls: ['./ttt-game.component.css']
})
export class TttGameComponent implements OnDestroy {

  readonly human = 'X';
  readonly ai = 'O';
  readonly cells = [0, 1, 2, 3, 4, 5, 6, 7, 8];
  readonly difficulties: { value: Difficulty, label: string }[] = [
    { value: 'easy', label: 'Easy' },
    { value: 'medium', label: 'Medium' },
    { value: 'hard', label: 'Hard' },
    { value: 'impossible', label: 'Impossible' }
  ];

  board: Cell[] = Array(9).fill(null);
  status: Status = 'human';
  difficulty: Difficulty = 'medium';
  humanStarts = true;
  winLine: number[] = [];
  lastMove = -1;
  message = 'Your move — you are X';
  score = { human: 0, ai: 0, draw: 0 };

  private aiTimer: any;

  get gameInProgress(): boolean {
    return this.board.some(c => c !== null) && this.status !== 'over';
  }

  setDifficulty(d: Difficulty): void {
    if (d === this.difficulty) { return; }
    this.difficulty = d;
    this.newRound();
  }

  setFirstPlayer(humanStarts: boolean): void {
    if (humanStarts === this.humanStarts) { return; }
    this.humanStarts = humanStarts;
    this.newRound();
  }

  play(index: number): void {
    if (this.status !== 'human' || this.board[index] !== null) { return; }
    this.place(index, this.human);
    if (this.status !== 'over') { this.queueAiMove(); }
  }

  newRound(): void {
    clearTimeout(this.aiTimer);
    this.board = Array(9).fill(null);
    this.winLine = [];
    this.lastMove = -1;
    if (this.humanStarts) {
      this.status = 'human';
      this.message = 'Your move — you are X';
    } else {
      this.queueAiMove();
    }
  }

  resetScore(): void {
    this.score = { human: 0, ai: 0, draw: 0 };
    this.newRound();
  }

  isWinningCell(i: number): boolean {
    return this.winLine.indexOf(i) !== -1;
  }

  private queueAiMove(): void {
    this.status = 'ai';
    this.message = 'AI is thinking…';
    // Small delay so the move feels natural and the user sees whose turn it is.
    this.aiTimer = setTimeout(() => {
      const move = chooseAiMove(this.board, this.ai, this.difficulty);
      if (move === -1) { return; }
      this.place(move, this.ai);
      if (this.status !== 'over') {
        this.status = 'human';
        this.message = 'Your move';
      }
    }, 450 + Math.random() * 350);
  }

  private place(index: number, player: 'X' | 'O'): void {
    this.board[index] = player;
    this.lastMove = index;
    const result = evaluateBoard(this.board);
    if (!result) { return; }

    this.status = 'over';
    this.winLine = result.line;
    if (result.winner === 'draw') {
      this.score.draw++;
      this.message = "It's a draw!";
    } else if (result.winner === this.human) {
      this.score.human++;
      this.message = 'You win! 🎉';
    } else {
      this.score.ai++;
      this.message = 'AI wins this round';
    }
  }

  ngOnDestroy(): void {
    clearTimeout(this.aiTimer);
  }
}

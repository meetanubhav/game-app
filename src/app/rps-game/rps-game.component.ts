import { Component, HostListener, OnDestroy } from '@angular/core';
import { MOVE_NAMES, Move, Round, RpsDifficulty, chooseRpsMove, judge } from './rps-ai';

type Phase = 'pick' | 'reveal' | 'result' | 'matchOver';

@Component({
  selector: 'app-rps-game',
  templateUrl: './rps-game.component.html',
  styleUrls: ['./rps-game.component.css']
})
export class RpsGameComponent implements OnDestroy {

  readonly moves: { value: Move, name: string, icon: string, key: string }[] = [
    { value: 0, name: 'Rock', icon: 'fa-hand-rock-o', key: 'R' },
    { value: 1, name: 'Paper', icon: 'fa-hand-paper-o', key: 'P' },
    { value: 2, name: 'Scissors', icon: 'fa-hand-scissors-o', key: 'S' }
  ];
  readonly difficulties: { value: RpsDifficulty, label: string, hint: string }[] = [
    { value: 'random', label: 'Casual', hint: 'The AI plays completely at random.' },
    { value: 'adaptive', label: 'Adaptive', hint: 'The AI learns your habits as you play.' },
    { value: 'master', label: 'Master', hint: 'The AI studies long patterns and rarely slips.' }
  ];
  readonly targets = [0, 3, 5];

  difficulty: RpsDifficulty = 'adaptive';
  target = 3;              // first to N wins the match; 0 = endless
  phase: Phase = 'pick';
  countdown = '';
  humanMove: Move | null = null;
  aiMove: Move | null = null;
  lastRound: Round | null = null;
  lastPrediction: Move | null = null;
  history: Round[] = [];
  score = { human: 0, ai: 0, tie: 0 };

  private timers: any[] = [];

  get hint(): string {
    return this.difficulties.find(d => d.value === this.difficulty).hint;
  }

  get recentRounds(): Round[] {
    return this.history.slice(-12).reverse();
  }

  get matchWinner(): 'human' | 'ai' | null {
    if (!this.target) { return null; }
    if (this.score.human >= this.target) { return 'human'; }
    if (this.score.ai >= this.target) { return 'ai'; }
    return null;
  }

  moveName(m: Move | null): string {
    return m === null ? '' : MOVE_NAMES[m];
  }

  iconFor(m: Move | null): string {
    return m === null ? 'fa-question' : this.moves[m].icon;
  }

  @HostListener('window:keydown', ['$event'])
  onKey(e: KeyboardEvent): void {
    const found = this.moves.find(m => m.key === e.key.toUpperCase());
    if (found) { this.play(found.value); }
  }

  setDifficulty(d: RpsDifficulty): void {
    if (d === this.difficulty) { return; }
    this.difficulty = d;
    this.newMatch();
  }

  setTarget(t: number): void {
    if (t === this.target) { return; }
    this.target = t;
    this.newMatch();
  }

  play(move: Move): void {
    if (this.phase === 'reveal' || this.phase === 'matchOver') { return; }

    // The AI commits to its move before looking at the human's pick.
    const decision = chooseRpsMove(this.history, this.difficulty);

    this.humanMove = move;
    this.aiMove = null;
    this.lastPrediction = decision.predicted;
    this.phase = 'reveal';

    const words = ['Rock…', 'Paper…', 'Scissors…'];
    words.forEach((w, i) => this.later(() => this.countdown = w, i * 220));
    this.later(() => this.finishRound(move, decision.move), words.length * 220);
  }

  newMatch(): void {
    this.clearTimers();
    this.history = [];
    this.score = { human: 0, ai: 0, tie: 0 };
    this.humanMove = this.aiMove = null;
    this.lastRound = null;
    this.lastPrediction = null;
    this.countdown = '';
    this.phase = 'pick';
  }

  private finishRound(human: Move, ai: Move): void {
    const outcome = judge(human, ai);
    const round: Round = { human, ai, outcome };
    this.aiMove = ai;
    this.lastRound = round;
    this.history.push(round);
    if (outcome === 'win') { this.score.human++; }
    else if (outcome === 'lose') { this.score.ai++; }
    else { this.score.tie++; }
    this.countdown = '';
    this.phase = this.matchWinner ? 'matchOver' : 'result';
  }

  private later(fn: () => void, ms: number): void {
    this.timers.push(setTimeout(fn, ms));
  }

  private clearTimers(): void {
    this.timers.forEach(t => clearTimeout(t));
    this.timers = [];
  }

  ngOnDestroy(): void {
    this.clearTimers();
  }
}

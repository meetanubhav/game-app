import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { TttGameComponent } from './ttt-game.component';
import { Cell, chooseAiMove, evaluateBoard } from './ttt-ai';

describe('TttGameComponent', () => {
  let component: TttGameComponent;
  let fixture: ComponentFixture<TttGameComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule],
      declarations: [TttGameComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TttGameComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('places the human mark and hands the turn to the AI', () => {
    component.play(4);
    expect(component.board[4]).toBe('X');
    expect(component.status).toBe('ai');
  });
});

describe('Tic Tac Toe AI', () => {
  it('detects a win', () => {
    const b: Cell[] = ['X', 'X', 'X', null, 'O', 'O', null, null, null];
    expect(evaluateBoard(b).winner).toBe('X');
  });

  it('takes a winning move on impossible', () => {
    const b: Cell[] = ['O', 'O', null, 'X', 'X', null, 'X', null, null];
    expect(chooseAiMove(b, 'O', 'impossible')).toBe(2);
  });

  it('blocks the opponent on impossible', () => {
    const b: Cell[] = ['X', 'X', null, null, 'O', null, null, null, null];
    expect(chooseAiMove(b, 'O', 'impossible')).toBe(2);
  });
});

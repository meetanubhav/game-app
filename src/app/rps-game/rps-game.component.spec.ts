import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { RpsGameComponent } from './rps-game.component';
import { Move, Round, chooseRpsMove, judge } from './rps-ai';

describe('RpsGameComponent', () => {
  let component: RpsGameComponent;
  let fixture: ComponentFixture<RpsGameComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule],
      declarations: [RpsGameComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RpsGameComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

describe('Rock Paper Scissors AI', () => {
  it('judges rounds correctly', () => {
    expect(judge(1, 0)).toBe('win');   // paper beats rock
    expect(judge(0, 1)).toBe('lose');
    expect(judge(2, 2)).toBe('tie');
  });

  it('learns to beat a player who always picks rock', () => {
    const history: Round[] = [];
    let aiWins = 0;
    for (let i = 0; i < 60; i++) {
      const ai = chooseRpsMove(history, 'master').move;
      const outcome = judge(0, ai);
      if (i >= 30 && outcome === 'lose') { aiWins++; }
      history.push({ human: 0 as Move, ai, outcome });
    }
    expect(aiWins).toBeGreaterThan(20);
  });
});

/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { TttGameComponent } from './ttt-game.component';

describe('TttGameComponent', () => {
  let component: TttGameComponent;
  let fixture: ComponentFixture<TttGameComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TttGameComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TttGameComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

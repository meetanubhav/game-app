/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { RpsGameComponent } from './rps-game.component';

describe('RpsGameComponent', () => {
  let component: RpsGameComponent;
  let fixture: ComponentFixture<RpsGameComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RpsGameComponent ]
    })
    .compileComponents();
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

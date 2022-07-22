/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { AppearanceCardComponent } from './appearance-card.component';

describe('AppearanceCardComponent', () => {
  let component: AppearanceCardComponent;
  let fixture: ComponentFixture<AppearanceCardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [AppearanceCardComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AppearanceCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

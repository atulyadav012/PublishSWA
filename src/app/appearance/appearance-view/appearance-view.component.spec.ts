/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { AppearanceViewComponent } from './appearance-view.component';

describe('AppearanceViewComponent', () => {
  let component: AppearanceViewComponent;
  let fixture: ComponentFixture<AppearanceViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [AppearanceViewComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AppearanceViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

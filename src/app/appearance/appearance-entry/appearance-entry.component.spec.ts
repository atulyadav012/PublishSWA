/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { AppearanceEntryComponent } from './appearance-entry.component';

describe('AppearanceEntryComponent', () => {
  let component: AppearanceEntryComponent;
  let fixture: ComponentFixture<AppearanceEntryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [AppearanceEntryComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AppearanceEntryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

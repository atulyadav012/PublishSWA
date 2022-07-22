/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { ApplyAppearanceComponent } from './apply-appearance.component';

describe('ApplyAppearanceComponent', () => {
  let component: ApplyAppearanceComponent;
  let fixture: ComponentFixture<ApplyAppearanceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ApplyAppearanceComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ApplyAppearanceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

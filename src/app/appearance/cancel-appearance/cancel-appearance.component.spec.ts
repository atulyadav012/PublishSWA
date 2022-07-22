/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { CancelAppearanceComponent } from './cancel-appearance.component';

describe('CancelAppearanceComponent', () => {
  let component: CancelAppearanceComponent;
  let fixture: ComponentFixture<CancelAppearanceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [CancelAppearanceComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CancelAppearanceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { AppearanceInfoComponent } from './appearance-info.component';

describe('AppearanceInfoComponent', () => {
  let component: AppearanceInfoComponent;
  let fixture: ComponentFixture<AppearanceInfoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [AppearanceInfoComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AppearanceInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

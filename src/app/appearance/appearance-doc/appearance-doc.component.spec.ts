/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { AppearanceDocComponent } from './appearance-doc.component';

describe('AppearanceDocComponent', () => {
  let component: AppearanceDocComponent;
  let fixture: ComponentFixture<AppearanceDocComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [AppearanceDocComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AppearanceDocComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

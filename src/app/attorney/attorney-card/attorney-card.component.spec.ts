/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { AttorneyCardComponent } from './attorney-card.component';

describe('AttorneyCardComponent', () => {
  let component: AttorneyCardComponent;
  let fixture: ComponentFixture<AttorneyCardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [AttorneyCardComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AttorneyCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

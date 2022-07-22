/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { AttorneyViewComponent } from './attorney-view.component';

describe('AttorneyViewComponent', () => {
  let component: AttorneyViewComponent;
  let fixture: ComponentFixture<AttorneyViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [AttorneyViewComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AttorneyViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

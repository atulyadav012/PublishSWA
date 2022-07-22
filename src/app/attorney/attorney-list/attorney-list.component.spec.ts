/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { AttorneyListComponent } from './attorney-list.component';

describe('AttorneyListComponent', () => {
  let component: AttorneyListComponent;
  let fixture: ComponentFixture<AttorneyListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [AttorneyListComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AttorneyListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

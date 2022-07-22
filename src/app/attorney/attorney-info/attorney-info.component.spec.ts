/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { AttorneyInfoComponent } from './attorney-info.component';

describe('AttorneyInfoComponent', () => {
  let component: AttorneyInfoComponent;
  let fixture: ComponentFixture<AttorneyInfoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [AttorneyInfoComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AttorneyInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

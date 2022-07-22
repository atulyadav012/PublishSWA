/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { InvocieListComponent } from './invocie-list.component';

describe('InvocieListComponent', () => {
  let component: InvocieListComponent;
  let fixture: ComponentFixture<InvocieListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InvocieListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InvocieListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RejectbyAttorneyComponent } from './rejectby-attorney.component';

describe('RejectbyAttorneyComponent', () => {
  let component: RejectbyAttorneyComponent;
  let fixture: ComponentFixture<RejectbyAttorneyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RejectbyAttorneyComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RejectbyAttorneyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

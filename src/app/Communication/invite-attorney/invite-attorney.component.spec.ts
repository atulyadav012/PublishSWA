import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InviteAttorneyComponent } from './invite-attorney.component';

describe('InviteAttorneyComponent', () => {
  let component: InviteAttorneyComponent;
  let fixture: ComponentFixture<InviteAttorneyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InviteAttorneyComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InviteAttorneyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

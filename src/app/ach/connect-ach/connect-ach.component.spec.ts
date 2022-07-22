import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConnectAchComponent } from './connect-ach.component';

describe('ConnectAchComponent', () => {
  let component: ConnectAchComponent;
  let fixture: ComponentFixture<ConnectAchComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ConnectAchComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ConnectAchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

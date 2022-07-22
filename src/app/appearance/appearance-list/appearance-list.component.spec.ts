import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AppearanceListComponent } from './appearance-list.component';

describe('AppearanceListComponent', () => {
  let component: AppearanceListComponent;
  let fixture: ComponentFixture<AppearanceListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AppearanceListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AppearanceListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });


  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

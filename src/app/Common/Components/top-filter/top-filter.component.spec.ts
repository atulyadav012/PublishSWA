import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TopFilterComponent } from './top-filter.component';

describe('TopFilterComponent', () => {
  let component: TopFilterComponent;
  let fixture: ComponentFixture<TopFilterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TopFilterComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TopFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

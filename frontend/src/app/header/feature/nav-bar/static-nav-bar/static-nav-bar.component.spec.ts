import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StaticNavBarComponent } from './static-nav-bar.component';

describe('StaticNavBarComponent', () => {
  let component: StaticNavBarComponent;
  let fixture: ComponentFixture<StaticNavBarComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [StaticNavBarComponent]
    });
    fixture = TestBed.createComponent(StaticNavBarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

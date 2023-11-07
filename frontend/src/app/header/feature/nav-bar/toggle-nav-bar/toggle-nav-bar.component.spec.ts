import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ToggleNavBarComponent } from './toggle-nav-bar.component';

describe('ToggleNavBarComponent', () => {
  let component: ToggleNavBarComponent;
  let fixture: ComponentFixture<ToggleNavBarComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ToggleNavBarComponent]
    });
    fixture = TestBed.createComponent(ToggleNavBarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StyledContainerComponent } from './styled-container.component';

describe('StyledContainerComponent', () => {
  let component: StyledContainerComponent;
  let fixture: ComponentFixture<StyledContainerComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [StyledContainerComponent]
    });
    fixture = TestBed.createComponent(StyledContainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

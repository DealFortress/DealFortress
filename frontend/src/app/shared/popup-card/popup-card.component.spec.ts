import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PopupCardComponent } from './popup-card.component';

describe('PopupCardComponent', () => {
  let component: PopupCardComponent;
  let fixture: ComponentFixture<PopupCardComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PopupCardComponent]
    });
    fixture = TestBed.createComponent(PopupCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

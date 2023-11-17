import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FullscreenImageCarouselComponent } from './fullscreen-image-carousel.component';

describe('FullscreenImageCarouselComponent', () => {
  let component: FullscreenImageCarouselComponent;
  let fixture: ComponentFixture<FullscreenImageCarouselComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [FullscreenImageCarouselComponent]
    });
    fixture = TestBed.createComponent(FullscreenImageCarouselComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { Image } from '@app/shared/models/image.model'

@Component({
  selector: 'app-image-carousel',
  templateUrl: './image-carousel.component.html',
  styleUrls: ['./image-carousel.component.css'],
})

export class ImageCarouselComponent {
  @Input({required: true}) images : Image[] = []
  @Output() toggleFullscreen = new EventEmitter<boolean>();
  currentIndex: number = 0;

  goToPrevious(): void {
    const isFirstSlide = this.currentIndex === 0;
    const newIndex = isFirstSlide
      ? this.images.length - 1
      : this.currentIndex - 1;
    this.currentIndex = newIndex;
  }

  goToNext(): void {
    const isLastSlide = this.currentIndex === this.images.length - 1;
    const newIndex = isLastSlide ? 0 : this.currentIndex + 1;

    this.currentIndex = newIndex;
  }

  goToSlide(slideIndex: number): void {
    this.currentIndex = slideIndex;
  }

}
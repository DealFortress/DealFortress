import { Component, Input} from '@angular/core';
import { Image } from '@app/shared/models/image.model'

@Component({
  selector: 'app-fullscreen-image-carousel',
  templateUrl: './fullscreen-image-carousel.component.html',
  styleUrls: ['./fullscreen-image-carousel.component.css'],
})

export class FullscreenImageCarouselComponent {
  @Input({required: true}) images : Image[] = []
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

  getCurrentSlideUrl() {
    return `url('${this.images[this.currentIndex].url}')`;
  }
}
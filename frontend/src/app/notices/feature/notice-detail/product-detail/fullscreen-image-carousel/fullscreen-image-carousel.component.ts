import { Component, EventEmitter, Input, OnDestroy, OnInit, Output, Renderer2} from '@angular/core';
import { Image } from '@app/shared/models/image.model'

@Component({
  selector: 'app-fullscreen-image-carousel',
  templateUrl: './fullscreen-image-carousel.component.html',
  styleUrls: ['./fullscreen-image-carousel.component.css'],
})

export class FullscreenImageCarouselComponent implements OnInit, OnDestroy{

  constructor(private renderer: Renderer2) {}

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

  ngOnInit(): void {
    this.renderer.addClass(document.body, 'p-0');
    this.renderer.addClass(document.body, 'overflow-hidden');
  }

  ngOnDestroy(): void {
    this.renderer.removeClass(document.body, 'p-0');
    this.renderer.removeClass(document.body, 'overflow-hidden');
  }

}
import { Component, EventEmitter, HostListener, Input, OnDestroy, OnInit, Output, Renderer2} from '@angular/core';
import { Image } from '@app/shared/models/image/image.model'

export enum KEY_CODE {
  RIGHT_ARROW = 39,
  LEFT_ARROW = 37
}

@Component({
  selector: 'app-fullscreen-image-carousel',
  templateUrl: './fullscreen-image-carousel.component.html',
  styleUrls: ['./fullscreen-image-carousel.component.css'],
})

export class FullscreenImageCarouselComponent implements OnInit, OnDestroy{

  private swipeCoord?: [number, number];
  private swipeTime?: number;


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

  @HostListener('window:keyup', ['$event'])
  keyEvent(event: KeyboardEvent) {

    if (event.keyCode === KEY_CODE.RIGHT_ARROW) {
      this.goToPrevious();
    }

    if (event.keyCode === KEY_CODE.LEFT_ARROW) {
      this.goToNext();
    }
  }

swipe(e: TouchEvent, when: string): void {
  const coord: [number, number] = [e.changedTouches[0].clientX, e.changedTouches[0].clientY];
  const time = new Date().getTime();

  if (when === 'start') {
    this.swipeCoord = coord;
    this.swipeTime = time;
  } 
  else if (when === 'end') {
    const direction = [coord[0] - this.swipeCoord![0], coord[1] - this.swipeCoord![1]];
    const duration = time - this.swipeTime!;

    if (duration < 1000
      && Math.abs(direction[0]) > 30
      && Math.abs(direction[0]) > Math.abs(direction[1] * 3)) {
        direction[0] < 0 ?  this.goToNext() : this.goToPrevious();
    }
  }
}
}
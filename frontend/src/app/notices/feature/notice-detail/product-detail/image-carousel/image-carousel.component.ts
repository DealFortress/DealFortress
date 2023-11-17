import { Component, Input } from '@angular/core';
import { Image } from '@app/shared/models/image.model'

@Component({
  selector: 'app-image-carousel',
  templateUrl: './image-carousel.component.html',
  styleUrls: ['./image-carousel.component.css']
})
export class ImageCarouselComponent {
  @Input({required: true}) imagesUrls : Image[] = []
}

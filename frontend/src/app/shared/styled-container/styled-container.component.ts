import { Component, Input, OnInit } from '@angular/core';
import { faXmark } from '@fortawesome/free-solid-svg-icons'

@Component({
  selector: 'app-styled-container',
  templateUrl: './styled-container.component.html',
  styleUrls: ['./styled-container.component.scss']
})
export class StyledContainerComponent {
  faXmark = faXmark;
  @Input() barText = "";
  @Input() redirectLink = "";
}

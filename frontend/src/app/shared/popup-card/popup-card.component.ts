import { Component, Input, OnDestroy, OnInit, Renderer2 } from '@angular/core';

@Component({
  selector: 'app-popup-card',
  templateUrl: './popup-card.component.html',
  styleUrls: ['./popup-card.component.css']
})
export class PopupCardComponent implements OnInit, OnDestroy{
  @Input() title? : string;
  @Input() body? : string;
  @Input() isCloseable? : boolean;

  constructor(private renderer: Renderer2) {}

  ngOnInit(): void {
    this.renderer.addClass(document.body, 'overflow-hidden');
  }

  ngOnDestroy(): void {
    this.renderer.removeClass(document.body, 'overflow-hidden');
  }
}

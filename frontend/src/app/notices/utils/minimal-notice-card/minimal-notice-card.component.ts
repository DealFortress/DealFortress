import { Component, Input, OnInit } from '@angular/core';
import { convertMinutesToClosestTimeValue } from '@app/shared/helper-functions/helper-functions';

import { Notice } from '@app/shared/models/notice/notice.model';

@Component({
  selector: 'app-minimal-notice-card',
  templateUrl: './minimal-notice-card.component.html',
  styleUrl: './minimal-notice-card.component.css'
})
export class MinimalNoticeCardComponent implements OnInit {
  @Input({required: true}) notice!: Notice ;
  minutesSinceCreation: string = '';

  constructor() {}
  ngOnInit(): void {
    this.minutesSinceCreation = convertMinutesToClosestTimeValue(this.notice.createdAt);
  }
}

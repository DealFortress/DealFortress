import { Component, Input, OnInit } from '@angular/core';
import { NoticesService } from '@app/notices/utils/services/notices.services';
import { Notice } from '@app/shared/models/notice.model';

@Component({
  selector: 'app-notice-card',
  templateUrl: './notice-card.component.html',
  styleUrls: ['./notice-card.component.scss']
})
export class NoticeCardComponent implements OnInit {
  @Input() notice!: Notice ;
  minutesSinceCreation: string = '';

  constructor() {}
  ngOnInit(): void {
    this.minutesSinceCreation = NoticesService.convertMinutesToClosestTimeValue(this.notice.createdAt);
  }
}
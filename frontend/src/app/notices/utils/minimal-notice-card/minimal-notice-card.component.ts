import { Component, Input } from '@angular/core';
import { NoticesService } from '../services/notices.services';
import { Notice } from '@app/shared/models/notice/notice.model';

@Component({
  selector: 'app-minimal-notice-card',
  templateUrl: './minimal-notice-card.component.html',
  styleUrl: './minimal-notice-card.component.css'
})
export class MinimalNoticeCardComponent {
  @Input({required: true}) notice!: Notice ;
  minutesSinceCreation: string = '';

  constructor() {}
  ngOnInit(): void {
    this.minutesSinceCreation = NoticesService.convertMinutesToClosestTimeValue(this.notice.createdAt);
  }
}

import { formatDate } from '@angular/common';
import { Component, Input } from '@angular/core';
import { convertDateToClosestTimeValue } from '@app/shared/helper-functions/helper-functions';
import { MessageNotification } from '@app/shared/models/message-notification.model';
import { getUserById } from '@app/users/data-access/store/users.selectors';
import { Store } from '@ngrx/store';

@Component({
  selector: 'app-notification-card',
  templateUrl: './notification-card.component.html',
  styleUrl: './notification-card.component.css'
})
export class NotificationCardComponent {
  @Input({required: true}) notification! : MessageNotification;


  constructor(private store: Store) {
    
  }

  getSender(senderId : number) {
    return this.store.select(getUserById(senderId));
  }

  getMinutesSinceCreation(time : Date) {
    return convertDateToClosestTimeValue(time);
  }
  getDateinString(createdAt : Date) {
    return formatDate(createdAt,'yyyy-MM-dd','en-US')
  }

  getNotificationTextPreview(text : string) {
    if (text.length > 30) {
      return text.slice(0, 30) + '...';
    }
    return text;
  }
}

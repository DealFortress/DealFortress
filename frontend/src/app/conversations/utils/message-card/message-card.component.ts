import { Component, Input } from '@angular/core';
import { Message } from '@app/shared/models/message/message';
import { User } from '@app/shared/models/user/user.model';

@Component({
  selector: 'app-message-card',

  templateUrl: './message-card.component.html',
  styleUrl: './message-card.component.css'
})
export class MessageCardComponent {
  @Input({required: true}) message!: Message;
  @Input({required: true}) user!: User;
  @Input({required: true}) recipient!: User;

  constructor() {}

}

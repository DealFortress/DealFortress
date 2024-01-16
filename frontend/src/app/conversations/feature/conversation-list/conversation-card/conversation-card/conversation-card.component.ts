import { Component, Input } from '@angular/core';
import { Conversation } from '@app/shared/models/conversation/conversation.model';

@Component({
  selector: 'app-conversation-card',
  templateUrl: './conversation-card.component.html',
  styleUrl: './conversation-card.component.css'
})
export class ConversationCardComponent {
 @Input({required: true}) conversation! : Conversation;


 getContactName(conversation : Conversation) {
  // get curren user id filter to goet the other person id and then grab the user name by the id
}

getLatestMessagePreview(conversation: Conversation) {
  const latestMessageText = conversation.messages[conversation.messages.length - 1].text;

  if (latestMessageText.length <= 30) {
    return latestMessageText;
  }
  
  return `${conversation.messages[conversation.messages.length - 1].text.slice(0, 30)}...`;
}
}

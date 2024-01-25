import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Router } from '@angular/router';
import { getConversationByNoticeId } from '@app/conversations/data-access/store/conversations.selectors';
import { User } from '@app/shared/models/user/user.model';
import { ShowAlert } from '@app/shared/store/app.actions';
import { getLoggedInUser} from '@app/users/data-access/store/users.selectors';
import { Store } from '@ngrx/store';
import { of } from 'rxjs';
import { EmitFlags } from 'typescript';



@Component({
  selector: 'app-user-card',
  templateUrl: './user-card.component.html',
  styleUrls: ['./user-card.component.css']
})
export class UserCardComponent {
 @Input({required: true}) user! : User ;
 @Output() toggleMessagePopup$ = new EventEmitter<boolean>(false);
 currentUser = this.store.select(getLoggedInUser)

 constructor(private store: Store, private router: Router) {}




}

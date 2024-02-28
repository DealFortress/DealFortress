import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Router } from '@angular/router';
import { User } from '@app/shared/models/user/user.model';
import { getLoggedInUser} from '@app/users/data-access/store/users.selectors';
import { Store } from '@ngrx/store';




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

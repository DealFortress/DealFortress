import { Component, Input } from '@angular/core';
import { User } from '@app/shared/models/user/user.model';
import { Observable } from 'rxjs';


@Component({
  selector: 'app-user-card',
  templateUrl: './user-card.component.html',
  styleUrls: ['./user-card.component.css']
})
export class UserCardComponent {
 @Input({required: true}) user! : User ;
}

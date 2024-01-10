import { Component, EventEmitter, Input, Output } from '@angular/core';
import { User } from '@app/shared/models/user/user.model';
import { EmitFlags } from 'typescript';



@Component({
  selector: 'app-user-card',
  templateUrl: './user-card.component.html',
  styleUrls: ['./user-card.component.css']
})
export class UserCardComponent {
 @Input({required: true}) user! : User ;
 @Output() toggleMessagePopup$ = new EventEmitter<boolean>(false);
}

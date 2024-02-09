import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { User } from '@app/shared/models/user/user.model';
import { getUserById } from '@app/users/data-access/store/users.selectors';
import { UsersService } from '@app/users/utils/services/users.service';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-user-detail',
  templateUrl: './user-detail.component.html',
  styleUrls: ['./user-detail.component.css']
})
export class UserDetailComponent implements OnInit{
  user? : Observable<User | undefined>;

  constructor(private store: Store, private route : ActivatedRoute, private usersService : UsersService) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(paramMap => {
      console.log(paramMap)
      if (paramMap.get('id')) {
        const id = +(paramMap.get('id')!);
        this.usersService.loadUserById(id)
        this.user = this.store.select(getUserById(id));
      }
    })
  }
}

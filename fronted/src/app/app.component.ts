import { Component, OnInit } from '@angular/core';
import { AuthService } from '@auth0/auth0-angular';
import { Store } from '@ngrx/store';
import { loadNoticesRequest } from './notices/data-access/store/notices.actions';
import { UsersService } from './users/utils/services/users.service';
import { getNoticesStatus } from './notices/data-access/store/notices.selectors';
import { Status } from './shared/models/state.model';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit{
  status = this.store.select(getNoticesStatus);
  Status = Status;

  constructor(private authService: AuthService, private usersService: UsersService,private store: Store) {
    store.dispatch(loadNoticesRequest());
  }

  async ngOnInit(): Promise<void> {
    this.authService.user$.subscribe(async user => {
      if (user) {
        this.usersService.setCurrentUser(user);
      }
    })
  }
}

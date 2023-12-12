import { Component, OnInit } from '@angular/core';
import { AuthService } from '@auth0/auth0-angular';
import { Store } from '@ngrx/store';
import { loadNoticesRequest } from './notices/data-access/store/notices.actions';
import { UsersService } from './users/utils/services/users.service';
import { getNoticesStatus } from './notices/data-access/store/notices.selectors';
import { Status } from './shared/models/state.model';
import { loadCategoriesRequest } from './categories/data-access/store/categories.actions';
import { HttpClient } from '@angular/common/http';
import { createSignalRHub } from 'ngrx-signalr-core';
import { messageHub } from './messages/utils/message.hub';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{
  status = this.store.select(getNoticesStatus);
  Status = Status;
  

  constructor(private authService: AuthService, private usersService: UsersService,private store: Store, private http: HttpClient) {

  }

  async ngOnInit(): Promise<void> {
    this.store.dispatch(loadNoticesRequest());
    this.store.dispatch(loadCategoriesRequest());

    this.authService.getAccessTokenSilently().subscribe(token => {
      if (token) {
        messageHub.options = {
          accessTokenFactory: () => {
            return token;
          }
        };

        this.store.dispatch(createSignalRHub(messageHub));
      }
    })

    this.authService.user$.subscribe(async user => {
      if (user) {
        this.usersService.setCurrentUser(user);
      }
    })
  }
}
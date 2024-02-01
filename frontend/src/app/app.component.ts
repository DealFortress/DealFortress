import { Component, OnInit } from '@angular/core';
import { AuthService } from '@auth0/auth0-angular';
import { Store } from '@ngrx/store';
import { loadNoticesRequest } from './notices/data-access/store/notices.actions';
import { UsersService } from './users/utils/services/users.service';
import { getNotices, getNoticesStatus } from './notices/data-access/store/notices.selectors';
import { Status } from './shared/models/state.model';
import { loadCategoriesRequest } from './categories/data-access/store/categories.actions';
import { createSignalRHub, startSignalRHub} from 'ngrx-signalr-core';
import { conversationHub } from './conversations/utils/conversation.hub';
import { loadUserByIdRequest } from './users/data-access/store/users.actions';
import { getLoggedInUserStatusCode } from './users/data-access/store/users.selectors';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{
  status = this.store.select(getNoticesStatus);
  Status = Status;
  notices = this.store.select(getNotices);
  

  constructor(private authService: AuthService, private usersService: UsersService,private store: Store) {

  }

  async ngOnInit(): Promise<void> {
    this.store.dispatch(loadNoticesRequest());
    this.store.dispatch(loadCategoriesRequest());

    this.authService.isAuthenticated$.subscribe(isAuth => {
      if (isAuth) {
        this.startConversationsHub();
      }
    })

    this.authService.user$.subscribe( user => {
      if (user) {
        this.usersService.setCurrentUser(user);
      }
    })

    this.notices.subscribe(notices => {
      if (notices) {
        notices.forEach(notice => this.store.dispatch(loadUserByIdRequest({id: notice.userId})))
      }
    })
  }

  startConversationsHub() {
    this.authService.getAccessTokenSilently().subscribe(token => {
      console.log('out');
      if (token) {
        console.log('in');
        conversationHub.options = {
          accessTokenFactory: () => {
            return token;
          }
        };
        
        this.store.dispatch(createSignalRHub(conversationHub));
      }
    })
  }
}

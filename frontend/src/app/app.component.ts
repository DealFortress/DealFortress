import { Component, OnInit } from '@angular/core';
import { AuthService } from '@auth0/auth0-angular';
import { Store } from '@ngrx/store';
import { UsersService } from './users/utils/services/users.service';
import { getNotices } from './notices/data-access/store/notices.selectors';
import { loadCategoriesRequest } from './categories/data-access/store/categories.actions';
import { createSignalRHub} from 'ngrx-signalr-core';
import { conversationHub } from './conversations/utils/conversation.hub';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{
  notices = this.store.select(getNotices);

  constructor(private authService: AuthService, private usersService: UsersService, private store: Store) {

  }

  async ngOnInit(): Promise<void> {
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
        notices.forEach(notice => this.usersService.loadUserById(notice.userId))
      }
    })
  }

  startConversationsHub() {
    this.authService.getAccessTokenSilently().subscribe(token => {
      if (token) {
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

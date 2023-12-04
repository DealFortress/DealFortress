import { Component, OnInit } from '@angular/core';
import { AuthService } from '@auth0/auth0-angular';
import { Store } from '@ngrx/store';
import { loadNoticesRequest } from './notices/data-access/store/notices.actions';
import { UsersService } from './users/utils/services/users.service';
import { getNoticesStatus } from './notices/data-access/store/notices.selectors';
import { Status } from './shared/models/state.model';
import { loadCategoriesRequest } from './categories/data-access/store/categories.actions';
import { SignalRService } from './messages/data-access/services/signal-r/signal-r.service';
import { environment } from 'environments/environment.production';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{
  status = this.store.select(getNoticesStatus);
  Status = Status;
  private baseUrl = environment.apiServerUrl;
  private messageUrl = `${this.baseUrl}/messages`;

  constructor(private authService: AuthService, private usersService: UsersService,private store: Store, public signalRService: SignalRService, private http: HttpClient) {
    store.dispatch(loadNoticesRequest());
    store.dispatch(loadCategoriesRequest());
  }

  async ngOnInit(): Promise<void> {
    this.signalRService
      .startConnection()
      .addTransferMessageDataListener();

    this.startHttpRequest();

    this.authService.user$.subscribe(async user => {
      if (user) {
        this.usersService.setCurrentUser(user);
      }
    })
  }

  private startHttpRequest() {
    this.http.get(this.messageUrl)
      .subscribe(res => {
        console.log(res);
      })
  }
}
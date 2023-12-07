import { HttpClient } from '@angular/common/http';
import { Injectable} from '@angular/core';
import { Message } from '@app/shared/models/message';
import { getUser } from '@app/users/data-access/store/users.selectors';
import { Store } from '@ngrx/store';
import { environment } from 'environments/environment.production';
import * as signalr from '@microsoft/signalr'
import { Subject } from 'rxjs';
import { AuthService } from '@auth0/auth0-angular';

@Injectable({
  providedIn: 'root'
})
export class MessagesApiService {
  private messageHubUrl = `${environment.hubServerUrl}/messages-hub`;

  constructor( private store: Store, public authService: AuthService,) {
      if (authService.isAuthenticated$)
      {

        this.startConnection();
      }
  }

  startConnection() {
    const connection = new signalr
      .HubConnectionBuilder()
      .configureLogging(signalr.LogLevel.Information)
      .withUrl(this.messageHubUrl)
      .build();

    connection.start()

    connection.on("sendjointext", data => {
      console.log(data);
  });
  }
}

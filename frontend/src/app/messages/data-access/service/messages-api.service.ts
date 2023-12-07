import { HttpClient } from '@angular/common/http';
import { Injectable} from '@angular/core';
import { Message } from '@app/shared/models/message';
import { getUser } from '@app/users/data-access/store/users.selectors';
import { Store } from '@ngrx/store';
import { environment } from 'environments/environment.production';
import { SignalrClient, SignalrConnection } from 'ngx-signalr-websocket';
import * as signalr from '@microsoft/signalr'
import { Subject } from 'rxjs';
import { AuthService } from '@auth0/auth0-angular';

@Injectable({
  providedIn: 'root'
})
export class MessagesApiService {
  private messageHubUrl = `${environment.hubServerUrl}/messages-hub`;
  private connection! : SignalrConnection;

  constructor(private httpClient: HttpClient, private store: Store, public authService: AuthService,) {
      if (authService.isAuthenticated$)
      {
        // SignalrClient
        // .create(this.httpClient)
        // .connect(this.messageHubUrl)
        // .subscribe(connection => {
        //   this.connection = connection
        // });
        this.startConnection();
      }
  }

  // startConnection(){
  //   return this.connection.on<[]>("sendjointext")
  // }

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

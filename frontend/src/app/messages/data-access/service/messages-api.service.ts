import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { environment } from 'environments/environment.production';
import { SignalrConnection } from 'ngx-signalr-websocket';
import * as signalr from '@microsoft/signalr'
import { AuthService } from '@auth0/auth0-angular';

@Injectable({
  providedIn: 'root'
})
export class MessagesApiService {
  private messageHubUrl = `${environment.hubServerUrl}/messages-hub`;
  private connection! : SignalrConnection;
  private options!: signalr.IHttpConnectionOptions;;

  constructor(private httpClient: HttpClient, private store: Store, public authService: AuthService,) {

    authService.getAccessTokenSilently().subscribe(token => {
      this.options = {
        accessTokenFactory: () => {
          return token;
        }
      };
    })

    authService.isAuthenticated$.subscribe(isAuthenticated => {
      if (isAuthenticated)
      {
        this.startConnection();
      }
    })
  }

  startConnection() {
    const connection = new signalr
      .HubConnectionBuilder()
      .configureLogging(signalr.LogLevel.Information)
      .withUrl(this.messageHubUrl, this.options)
      .build();

    connection.start()

    connection.on("sendjointext", data => {
      console.log(data);
    });

    connection.on("sendmessages", data => {
      console.log(data);
  });
  }
}

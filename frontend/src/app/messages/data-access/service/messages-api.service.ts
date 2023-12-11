import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { environment } from 'environments/environment.production';
import * as signalr from '@microsoft/signalr'
import { AuthService } from '@auth0/auth0-angular';
import { Message } from '@app/shared/models/message';
import { MessageService } from '../ngrx-data/message.service';
import { ConsoleLogger } from '@microsoft/signalr/dist/esm/Utils';

@Injectable({
  providedIn: 'root'
})
export class MessagesApiService {
  private messageHubUrl = `${environment.hubServerUrl}/messages-hub`;
  private options!: signalr.IHttpConnectionOptions;
  private connection? : signalr.HubConnection;

  constructor(public authService: AuthService) {

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
    // this.connection = connection;

    connection.on("sendjointext", data => {
      console.log(data);
    });
  }


  // getAll() {
  //   this.connection?.on("sendmessages", (data : Message[]) => 
  //   this.messageService.addAll(data)
  //  );
  // };
}



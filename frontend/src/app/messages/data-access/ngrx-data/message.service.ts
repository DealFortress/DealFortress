import { Injectable } from '@angular/core';
import { Message } from '@app/shared/models/message';
import { AuthService } from '@auth0/auth0-angular';
import { HttpClient } from '@microsoft/signalr';
import {
  EntityCollectionServiceBase,
  EntityCollectionServiceElementsFactory
} from '@ngrx/data';
import { Store } from '@ngrx/store';
import { environment } from 'environments/environment.production';
import { Observable, of } from 'rxjs';
import * as signalr from '@microsoft/signalr';

 
@Injectable({ providedIn: 'root' })
export class MessageService extends EntityCollectionServiceBase<Message> {
  private messageHubUrl = `${environment.hubServerUrl}/messages-hub`;
  private options!: signalr.IHttpConnectionOptions;
  private connection? : signalr.HubConnection;

  constructor(serviceElementsFactory: EntityCollectionServiceElementsFactory, public authService: AuthService) {
    super('Message', serviceElementsFactory);

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

  override getAll(){
    return this.entities$;
  }

  addAll(messages : Message[]) {
    // this.connection?.on("sendmessages", (data : Message[]) => 
    // this.addAll(data)
    // );
    // this.entities$ = of(messages);
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

}
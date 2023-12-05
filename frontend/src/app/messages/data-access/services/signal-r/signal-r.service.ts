import { Injectable } from '@angular/core';
import { Message } from '@app/shared/models/message';
import * as signalR from '@microsoft/signalr';
import { environment } from 'environments/environment.production';


@Injectable({
  providedIn: 'root'
})
export class SignalRService {
  public messages?: Message[];
  private baseUrl = environment.hubServerUrl;
  private messageUrl = `${this.baseUrl}/messages-hub`;
  private hubConnection?: signalR.HubConnection;

  public startConnection = () => {
    this.hubConnection = new signalR.HubConnectionBuilder()
      .withUrl(this.messageUrl)
      .configureLogging(signalR.LogLevel.Information)
      .build();

    this.hubConnection
      .start()
      .then(() => console.log('Connection starter'))
      .catch(err => console.log('Error while starting connection: ' + err));

    return this;
  }

  public addTransferMessageDataListener = () => {
    this.hubConnection?.on('transfermessagedata', (data) => {
      this.messages = data;
      console.log(data);
    })
  }

  constructor() { 

  }
}
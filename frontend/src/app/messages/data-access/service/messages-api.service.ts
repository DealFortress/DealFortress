import { HttpClient } from '@angular/common/http';
import { Injectable} from '@angular/core';
import { Message } from '@app/shared/models/message';
import { environment } from 'environments/environment.production';
import { SignalrClient, SignalrConnection } from 'ngx-signalr-websocket';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MessagesApiService {
  private messageHubUrl = `${environment.hubServerUrl}/messages-hub`;
  private connection! : SignalrConnection;

  constructor(private httpClient: HttpClient) {
    
    SignalrClient
      .create(this.httpClient)
      .connect(this.messageHubUrl)
      .subscribe(connection => this.connection = connection);
  }

  startConnection(){
    return this.connection.on<Message[]>("sendjointext")
  }

  // startConnection() {
  //   const connection = new signalr
  //     .HubConnectionBuilder()
  //     .configureLogging(signalr.LogLevel.Information)
  //     .withUrl(this.messageHubUrl)
  //     .build();

  // connection
  // .start()
  // .then(data => console.log(data))

  // const subject = new Subject<Message[]>();
  // connection.stream<Message[]>("test").subscribe(subject);
  // return subject.asObservable();
// }
}

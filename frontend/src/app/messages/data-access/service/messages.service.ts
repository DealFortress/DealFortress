import { Injectable} from '@angular/core';
import { Message } from '@app/shared/models/message';
import * as signalr from '@microsoft/signalr'
import { environment } from 'environments/environment.production';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MessagesService {
  private messageHubUrl = `${environment.hubServerUrl}/message-hub`;


  constructor() { }


  startConnection() {
    const connection = new signalr
      .HubConnectionBuilder()
      .configureLogging(signalr.LogLevel.Information)
      .withUrl(this.messageHubUrl)
      .build();

  connection
  .start()
  .then(data => console.log(data))

  const subject = new Subject<Message[]>();
  connection.stream<Message[]>("test").subscribe(subject);
  return subject.asObservable();
  }
}

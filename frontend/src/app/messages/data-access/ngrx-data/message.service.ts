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
import { MessagesApiService } from '../service/messages-api.service';

 
@Injectable({ providedIn: 'root' })
export class MessageService extends EntityCollectionServiceBase<Message> {

  constructor(serviceElementsFactory: EntityCollectionServiceElementsFactory,private messagesApiService : MessagesApiService) {
    super('Message', serviceElementsFactory);
  }

  // override getAll(){
  //   this.messagesApiService.getAll()
  //   return this.entities$;
  // }

  addAll(messages : Message[]) {
    this.entities$ = of(messages);
  }

}
import { Injectable } from '@angular/core';
import { Message } from '@app/shared/models/message';
import {
  EntityCollectionServiceBase,
  EntityCollectionServiceElementsFactory
} from '@ngrx/data';

 
@Injectable({ providedIn: 'root' })
export class MessageService extends EntityCollectionServiceBase<Message> {
  constructor(serviceElementsFactory: EntityCollectionServiceElementsFactory) {
    super('Message', serviceElementsFactory);
  }
}
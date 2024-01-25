import { Injectable } from '@angular/core';
import { UserRequest } from '@app/shared/models/user/user-request.model';
import { loadUserByAuthIdRequest, postUserRequest } from '@app/users/data-access/store/users.actions';
import { getStatusCode } from '@app/users/data-access/store/users.selectors';
import { User } from '@auth0/auth0-angular';
import { Store } from '@ngrx/store';

@Injectable({
  providedIn: 'root'
})
export class UsersService {

  constructor(private store: Store) { }

  setCurrentUser(authUser: User) {
    const isNewUser = authUser['/isNewUser'];

    if (isNewUser) {
      this.createUser(authUser)
      return;
    }

    if (authUser.sub) {
      this.store.dispatch(loadUserByAuthIdRequest({authId: authUser.sub}))

      this.store.select(getStatusCode).subscribe(code => {
        if (code == 404 ) {
          this.createUser(authUser);
        }
      })
    }
    
  }

  

  createUser(authUser: User) {
    const postRequest: UserRequest = {
        authId: authUser.sub,
        email: authUser.email,
        username: authUser.name,
        avatar: authUser.picture
      } as UserRequest;

    this.store.dispatch(postUserRequest(postRequest))
  }
}

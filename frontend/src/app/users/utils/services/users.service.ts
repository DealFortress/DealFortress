import { Injectable, OnChanges, SimpleChanges } from '@angular/core';
import { UserRequest } from '@app/shared/models/user/user-request.model';
import { loadLoggedInUserByAuthIdRequest, loadUserByIdRequest, postUserRequest } from '@app/users/data-access/store/users.actions';
import { getLoggedInUserId, getLoggedInUserStatusCode, getUserById } from '@app/users/data-access/store/users.selectors';
import {  User as authUser } from '@auth0/auth0-angular';
import { Store } from '@ngrx/store';

@Injectable({
  providedIn: 'root'
})
export class UsersService {

  constructor(private store: Store) { }


  setCurrentUser(authUser: authUser) {
    const isNewUser = authUser['/isNewUser'];

    if (isNewUser) {
      this.createUser(authUser)
      
      this.store.select(getLoggedInUserStatusCode).subscribe(statusCode => {
          if (statusCode == 201 && authUser.sub) {
              this.store.dispatch(loadLoggedInUserByAuthIdRequest({authId: authUser.sub}))
               return
            }
      })
    }
        

    if (authUser.sub && !isNewUser ) {
      this.store.dispatch(loadLoggedInUserByAuthIdRequest({authId: authUser.sub}))

      this.store.select(getLoggedInUserStatusCode).subscribe(code => {
        if (code == 404 ) {

        this.createUser(authUser);
        }
      })
    }
    
  }

  

  createUser(authUser: authUser) {
    const postRequest: UserRequest = {
        authId: authUser['sub'],
        email: authUser['email'],
        username: authUser['name'],
        avatar: authUser['picture']
      } as UserRequest;

    this.store.dispatch(postUserRequest(postRequest))
  }

  loadUserById(id: number) {
    this.store.select(getUserById(id)).subscribe(async recipient => {
      if (recipient == undefined ) {

        this.store.select(getLoggedInUserId).subscribe(loggedInUserId => {
          if (loggedInUserId != id) {
            this.store.dispatch(loadUserByIdRequest({id :id}));
          }
        })

      } 
    })
  }
}

import { Injectable, OnChanges, SimpleChanges } from '@angular/core';
import { UserRequest } from '@app/shared/models/user/user-request.model';
import { loadLoggedInUserByAuthIdRequest, loadUserByIdRequest, postUserRequest } from '@app/users/data-access/store/users.actions';
import { getLoggedInUserStatusCode, getUserById } from '@app/users/data-access/store/users.selectors';
import { AuthService, User } from '@auth0/auth0-angular';
import { Store } from '@ngrx/store';

@Injectable({
  providedIn: 'root'
})
export class UsersService {

  constructor(private store: Store,private authService: AuthService) { }


  setCurrentUser(authUser: User) {
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

  

  createUser(authUser: User) {
    const postRequest: UserRequest = {
        authId: authUser['sub'],
        email: authUser['email'],
        username: authUser['name'],
        avatar: authUser['picture']
      } as UserRequest;

      console.log(postRequest);

    this.store.dispatch(postUserRequest(postRequest))
  }

  // loadUserById(id: number) {
  //   return this.store.select(getUserById(id)).pipe(recipient => {
  //     if (recipient == undefined) {
  //       this.store.dispatch(loadUserByIdRequest({id :id}));
  //       return this.store.select(getUserById(id)); 
  //     } else {
  //       return this.store.select(getUserById(id)); 
  //     }
  //   })
  // }
}

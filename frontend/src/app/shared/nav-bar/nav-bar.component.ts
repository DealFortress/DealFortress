import { Component, OnInit } from '@angular/core';
import { User } from '@app/shared/models/user/user.model';
import { getLoggedInUser } from '@app/users/data-access/store/users.selectors';
import { AuthService } from '@auth0/auth0-angular';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.css']
})
export class NavBarComponent implements OnInit{
  isAuthenticated = this.authService.isAuthenticated$;
  user? : Observable< User | undefined>
  

  constructor(private authService: AuthService, private store: Store) {}
  ngOnInit(): void {
    this.isAuthenticated.subscribe(isAuthenticated => {
      if (isAuthenticated) {
        this.user = this.store.select(getLoggedInUser)
      }
    })
  }
}


import { Component, OnInit } from '@angular/core';
import { AuthService } from '@auth0/auth0-angular';

@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.css']
})
export class NavBarComponent{
  isAuthenticated = this.authService.isAuthenticated$;
  user = this.authService.user$;

  constructor(private authService: AuthService) {}
}


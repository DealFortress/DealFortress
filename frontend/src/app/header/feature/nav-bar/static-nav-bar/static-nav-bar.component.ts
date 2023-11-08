import { Component, OnDestroy, OnInit } from '@angular/core';
import { NavbarService } from '../nav-bar.service';
import { AuthService } from '@auth0/auth0-angular';

@Component({
  selector: 'app-static-nav-bar',
  templateUrl: './static-nav-bar.component.html',
  styleUrls: ['./static-nav-bar.component.scss']
})
export class StaticNavBarComponent {
  isAuthenticated = this.authService.isAuthenticated$;
  user = this.authService.user$;

  constructor(private navbarService: NavbarService, private authService: AuthService) {}

  setNavbarToggle() {
    this.navbarService.setNavbarToggle();
  }

}

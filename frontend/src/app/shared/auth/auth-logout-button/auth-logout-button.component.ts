import { Component, Inject } from '@angular/core';
import { AuthService } from '@auth0/auth0-angular';
import { DOCUMENT } from '@angular/common';


@Component({
  selector: 'app-auth-logout-button',
  templateUrl: './auth-logout-button.component.html',
  styleUrls: ['./auth-logout-button.component.css']
})
export class AuthLogoutButtonComponent {
  constructor(@Inject(DOCUMENT) public document: Document, public auth: AuthService) {}
}
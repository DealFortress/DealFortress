import { Component } from '@angular/core';
import { AuthService } from '@auth0/auth0-angular';

@Component({
  selector: 'app-auth-login-button',
  templateUrl: './auth-login-button.component.html',
  styleUrls: ['./auth-login-button.component.css']
})
export class AuthLoginButtonComponent {
  constructor(public auth: AuthService) {}
} 
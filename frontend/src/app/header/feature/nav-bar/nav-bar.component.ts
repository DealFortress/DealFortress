import { Component, OnInit } from '@angular/core';
import { NavbarService } from './nav-bar.service';

@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.scss']
})
export class NavBarComponent{
  navbarToggle$ = this.navbarService.navbarToggle$;
  
  constructor(private navbarService: NavbarService) {}
}

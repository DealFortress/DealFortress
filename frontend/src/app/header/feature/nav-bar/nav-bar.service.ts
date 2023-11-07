import { EventEmitter } from "@angular/core";

export class NavbarService {
    navbarToggle: boolean = false;
    navbarToggle$ = new EventEmitter<boolean>();

    setNavbarToggle() {
        this.navbarToggle = !this.navbarToggle;
        this.navbarToggle$.emit(this.navbarToggle);
    }

    getNavbarToggle() {
        return this.navbarToggle;
    }
}
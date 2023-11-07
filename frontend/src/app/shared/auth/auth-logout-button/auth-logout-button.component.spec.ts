import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AuthLogoutButtonComponent } from './auth-logout-button.component';

describe('AuthLogoutButtonComponent', () => {
  let component: AuthLogoutButtonComponent;
  let fixture: ComponentFixture<AuthLogoutButtonComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AuthLogoutButtonComponent]
    });
    fixture = TestBed.createComponent(AuthLogoutButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

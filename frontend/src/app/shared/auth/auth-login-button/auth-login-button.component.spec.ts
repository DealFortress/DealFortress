import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AuthLoginButtonComponent } from './auth-login-button.component';

describe('AuthButtonComponent', () => {
  let component: AuthLoginButtonComponent;
  let fixture: ComponentFixture<AuthLoginButtonComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AuthLoginButtonComponent]
    });
    fixture = TestBed.createComponent(AuthLoginButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

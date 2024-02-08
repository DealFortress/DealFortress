import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConversationsNotificationsDropdownComponent } from './conversations-notifications-dropdown.component';

describe('ConversationNotificationDropdownComponent', () => {
  let component: ConversationsNotificationsDropdownComponent;
  let fixture: ComponentFixture<ConversationsNotificationsDropdownComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConversationsNotificationsDropdownComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ConversationsNotificationsDropdownComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

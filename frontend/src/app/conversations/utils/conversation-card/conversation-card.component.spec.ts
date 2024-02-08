import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConversationCardComponent } from './conversation-card.component';

describe('ConversationCardComponent', () => {
  let component: ConversationCardComponent;
  let fixture: ComponentFixture<ConversationCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConversationCardComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ConversationCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

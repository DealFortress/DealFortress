import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConversationCreateComponent } from './conversation-create.component';

describe('ConversationCreateComponent', () => {
  let component: ConversationCreateComponent;
  let fixture: ComponentFixture<ConversationCreateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConversationCreateComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ConversationCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

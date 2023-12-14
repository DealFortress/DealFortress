import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConversationDetailComponent } from './conversation-detail.component';

describe('ConversationDetailComponent', () => {
  let component: ConversationDetailComponent;
  let fixture: ComponentFixture<ConversationDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConversationDetailComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ConversationDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

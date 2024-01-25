import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MessagesCreateComponent } from './messages-create.component';

describe('MessagesCreateComponent', () => {
  let component: MessagesCreateComponent;
  let fixture: ComponentFixture<MessagesCreateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MessagesCreateComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(MessagesCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

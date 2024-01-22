import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MinimalNoticeCardComponent } from './minimal-notice-card.component';

describe('MinimalNoticeCardComponent', () => {
  let component: MinimalNoticeCardComponent;
  let fixture: ComponentFixture<MinimalNoticeCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MinimalNoticeCardComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(MinimalNoticeCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

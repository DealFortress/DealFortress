import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NoticeDetailComponent } from './notice-detail.component';

describe('NoticeDetailComponent', () => {
  let component: NoticeDetailComponent;
  let fixture: ComponentFixture<NoticeDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [NoticeDetailComponent]
    });
    fixture = TestBed.createComponent(NoticeDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

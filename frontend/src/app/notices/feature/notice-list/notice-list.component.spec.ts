import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NoticeListComponent } from './notice-list.component';

describe('NoticeListComponent', () => {
  let component: NoticeListComponent;
  let fixture: ComponentFixture<NoticeListComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [NoticeListComponent]
    });
    fixture = TestBed.createComponent(NoticeListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

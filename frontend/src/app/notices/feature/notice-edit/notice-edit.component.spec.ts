import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NoticeEditComponent } from './notice-edit.component';

describe('NoticeEditComponent', () => {
  let component: NoticeEditComponent;
  let fixture: ComponentFixture<NoticeEditComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [NoticeEditComponent]
    });
    fixture = TestBed.createComponent(NoticeEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

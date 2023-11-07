import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NoticeFormComponent } from './notice-form.component';

describe('NoticeFormComponent', () => {
  let component: NoticeFormComponent;
  let fixture: ComponentFixture<NoticeFormComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [NoticeFormComponent]
    });
    fixture = TestBed.createComponent(NoticeFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

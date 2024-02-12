import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { getNoticeById, getNoticeByUserId } from '@app/notices/data-access/store/notices.selectors';
import { convertDateToMinutes, convertDateToClosestTimeValue } from '@app/shared/helper-functions/helper-functions';
import { Notice } from '@app/shared/models/notice/notice.model';
import { User } from '@app/shared/models/user/user.model';
import { getUserById } from '@app/users/data-access/store/users.selectors';
import { UsersService } from '@app/users/utils/services/users.service';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-user-detail',
  templateUrl: './user-detail.component.html',
  styleUrls: ['./user-detail.component.css']
})
export class UserDetailComponent implements OnInit{
  user? : Observable<User | undefined>;
  userNotices? : Observable<Notice[] | undefined>;
  tabName = TabName;
  activeTab = this.tabName.notices;


  constructor(private store: Store, private route : ActivatedRoute, private usersService : UsersService) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(paramMap => {
      if (paramMap.get('id')) {
        const id = +(paramMap.get('id')!);
        this.usersService.loadUserById(id)
        this.user = this.store.select(getUserById(id));
        this.userNotices = this.store.select(getNoticeByUserId(id));
      }
    })
  }

  setActiveTab(tabName : TabName) {
    this.activeTab = tabName;
  }

  getUserJoinTimeLapse(user : User) {
    return convertDateToClosestTimeValue(user.createdAt);
  }

}

enum TabName {
  notices = 'notices',
  reviews = 'reviews'
}

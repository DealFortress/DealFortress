import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NoticeDetailComponent } from '@app/notices/feature/notice-detail/notice-detail.component';
import { NoticeListComponent } from '@app/notices/feature/notice-list/notice-list.component';
import { NotFoundComponent } from '@app/shared/not-found/not-found.component';
import { NoticeCreateComponent } from '@app/notices/feature/notice-create/notice-create.component';
import { NoticeEditComponent } from '@app/notices/feature/notice-edit/notice-edit.component';
import { ConversationListComponent } from '@app/conversations/feature/conversation-list/conversation-list.component';
import { UserProfileComponent } from '@app/users/feature/user-profile/user-profile.component';






const routes: Routes = [
  {path: '', redirectTo: '/notices', pathMatch: 'full'},
  {path: 'notices', component: NoticeListComponent},
  {path: 'notices/create', component: NoticeCreateComponent},
  {path: 'notices/:id/edit', component: NoticeEditComponent},
  {path: 'notices/:id', component: NoticeDetailComponent },
  {path: 'conversations', component: ConversationListComponent },
  {path: 'conversations/:id', component: ConversationListComponent},
  {path: 'user/:id', component: UserProfileComponent}, 
  {path: '**', component: NotFoundComponent}
];


@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule { }

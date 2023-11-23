import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NoticeDetailComponent } from '@app/notices/feature/notice-detail/notice-detail.component';
import { NoticeListComponent } from '@app/notices/feature/notice-list/notice-list.component';
import { NotFoundComponent } from '@app/shared/not-found/not-found.component';
import { NoticeCreateComponent } from '@app/notices/feature/notice-create/notice-create.component';
import { NoticeEditComponent } from '@app/notices/feature/notice-edit/notice-edit.component';






const routes: Routes = [
  {path: '', redirectTo: '/notices', pathMatch: 'full'},
  {path: 'notices', component: NoticeListComponent},
  {path: 'notices/create', component: NoticeCreateComponent},
  {path: 'notices/edit', component: NoticeEditComponent},
  {path: 'notices/:id', component: NoticeDetailComponent },
  {path: '**', component: NotFoundComponent}
];


@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule { }

import { NgModule } from '@angular/core';
import { ExtraOptions, RouterModule, Routes } from '@angular/router';
import { NoticeDetailComponent } from '@app/notices/feature/notice-detail/notice-detail.component';
import { NoticeListComponent } from '@app/notices/feature/notice-list/notice-list.component';
import { NoticeFormComponent } from '@app/notices/feature/notice-form/notice-form.component';
import { NotFoundComponent } from '@app/shared/not-found/not-found.component';






const routes: Routes = [
  {path: '', redirectTo: '/notices', pathMatch: 'full'},
  {path: 'notices', component: NoticeListComponent},
  {path: 'notices/create', component: NoticeFormComponent},
  {path: 'notices/:id', component: NoticeDetailComponent },
  {path: '**', component: NotFoundComponent}
];


@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule { }

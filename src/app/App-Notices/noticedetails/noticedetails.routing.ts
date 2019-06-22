import { Routes } from '@angular/router';

import { NoticedetailsComponent } from './noticedetails.component';

export const NoticedetailsRoutes: Routes = [
    {

      path: '',
      children: [ {
        path: ':id',
        component: NoticedetailsComponent
    }]
}
];
import { Routes } from '@angular/router';

import { MemberdetailsComponent } from './memberdetails.component';

export const MemberdetailsRoutes: Routes = [
    {

      path: ':group',
      children: [ {
        path: ':id',
        component: MemberdetailsComponent
    }]
}
];
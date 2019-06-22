import { Routes } from '@angular/router';

import { MemberaddComponent } from './memberadd.component';

export const MemberaddRoutes: Routes = [
    {

      path: 'members',
      children: [ {
        path: ':id',
        component: MemberaddComponent
    }]
}
];
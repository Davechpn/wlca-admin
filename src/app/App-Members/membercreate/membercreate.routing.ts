import { Routes } from '@angular/router';

import { MembercreateComponent } from './membercreate.component';

export const MembercreateRoutes: Routes = [
    {

      path: '',
      children: [ {
        path: 'new',
        component: MembercreateComponent
    }]
}
];
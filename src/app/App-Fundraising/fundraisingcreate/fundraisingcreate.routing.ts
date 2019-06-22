import { Routes } from '@angular/router';

import { FundraisingcreateComponent } from './fundraisingcreate.component';

export const FundraisingcreateRoutes: Routes = [
    {

      path: '',
      children: [ {
        path: 'new',
        component: FundraisingcreateComponent
    }]
}
];
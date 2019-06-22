import { Routes } from '@angular/router';

import { FundraisingdetailsComponent } from './fundraisingdetails.component';

export const FundraisingdetailsRoutes: Routes = [
    {

      path: '',
      children: [ {
        path: ':id',
        component: FundraisingdetailsComponent
    }]
}
];
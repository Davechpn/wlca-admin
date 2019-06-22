import { Routes } from '@angular/router';

import { worddetailsComponent } from './worddetails.component';

export const worddetailsRoutes: Routes = [
    {

      path: '',
      children: [ {
        path: ':id',
        component: worddetailsComponent
    }]
}
];
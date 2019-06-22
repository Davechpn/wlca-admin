import { Routes } from '@angular/router';

import { ExpendituredetailsComponent } from './expendituredetails.component';

export const ExpendituredetailsRoutes: Routes = [
    {

      path: '',
      children: [ {
        path: ':id',
        component: ExpendituredetailsComponent
    }]
}
];
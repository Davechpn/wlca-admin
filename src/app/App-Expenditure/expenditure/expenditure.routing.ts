import { Routes } from '@angular/router';

import { ExpenditureComponent } from './expenditure.component';

export const ExpenditureRoutes: Routes = [
    {

      path: '',
      children: [ {
        path: '',
        component: ExpenditureComponent
    }]
}
];
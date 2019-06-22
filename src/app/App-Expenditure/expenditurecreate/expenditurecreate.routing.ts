import { Routes } from '@angular/router';

import { ExpenditurecreateComponent } from './expenditurecreate.component';

export const ExpenditurecreateRoutes: Routes = [
    {

      path: '',
      children: [ {
        path: 'new',
        component: ExpenditurecreateComponent
    }]
}
];
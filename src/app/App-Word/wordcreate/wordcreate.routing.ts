import { Routes } from '@angular/router';

import { wordcreateComponent } from './wordcreate.component';

export const wordcreateRoutes: Routes = [
    {

      path: '',
      children: [ {
        path: 'new',
        component: wordcreateComponent
    }]
}
];
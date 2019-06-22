import { Routes } from '@angular/router';

import { NoticecreateComponent } from './noticecreate.component';

export const NoticecreateRoutes: Routes = [
    {

      path: '',
      children: [ {
        path: 'new',
        component: NoticecreateComponent
    }]
}
];
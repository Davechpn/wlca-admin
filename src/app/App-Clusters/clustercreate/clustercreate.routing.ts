import { Routes } from '@angular/router';

import { ClustercreateComponent } from './clustercreate.component';

export const ClustercreateRoutes: Routes = [
    {

      path: '',
      children: [ {
        path: 'new',
        component: ClustercreateComponent
    }]
}
];
import { Routes } from '@angular/router';

import { NoticesComponent } from './notices.component';

export const NoticesRoutes: Routes = [
    {

      path: '',
      children: [ {
        path: '',
        component: NoticesComponent
    }]
}
];
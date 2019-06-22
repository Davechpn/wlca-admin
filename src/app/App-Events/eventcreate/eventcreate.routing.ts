import { Routes } from '@angular/router';

import { EventcreateComponent } from './eventcreate.component';

export const EventcreateRoutes: Routes = [
    {

      path: '',
      children: [ {
        path: 'new',
        component: EventcreateComponent
    }]
}
];
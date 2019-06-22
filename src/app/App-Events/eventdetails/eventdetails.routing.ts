import { Routes } from '@angular/router';

import { EventdetailsComponent } from './eventdetails.component';

export const EventdetailsRoutes: Routes = [
    {

      path: '',
      children: [ {
        path: ':id',
        component: EventdetailsComponent
    }]
}
];
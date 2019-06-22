import { Routes } from '@angular/router';

import { ClusterdetailsComponent } from './clusterdetails.component';

export const ClusterdetailsRoutes: Routes = [
    {

      path: '',
      children: [ {
        path: ':id',
        component: ClusterdetailsComponent
    }]
}
];
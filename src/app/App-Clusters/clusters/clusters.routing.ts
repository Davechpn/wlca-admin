import { Routes } from '@angular/router';

import { ClustersComponent } from './clusters.component';

export const ClustersRoutes: Routes = [
    {

      path: '',
      children: [ {
        path: '',
        component: ClustersComponent
    }]
}
];
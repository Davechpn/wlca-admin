import { Routes } from '@angular/router';

import { PaypledgeComponent } from './paypledge.component';

export const paypledgeRoutes: Routes = [
    {

      path: 'pledges',
      children: [ {
        path: 'pay/:id',
        component: PaypledgeComponent
    }]
}
];
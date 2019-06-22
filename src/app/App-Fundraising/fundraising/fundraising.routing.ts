import { Routes } from '@angular/router';

import { FundraisingComponent } from './fundraising.component';

export const FundraisingRoutes: Routes = [
    {

      path: '',
      children: [ {
        path: '',
        component: FundraisingComponent
    }]
}
];
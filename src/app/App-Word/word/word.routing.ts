import { Routes } from '@angular/router';

import { wordComponent } from './word.component';

export const wordRoutes: Routes = [
    {

      path: '',
      children: [ {
        path: '',
        component: wordComponent
    }]
}
];
import { Routes } from '@angular/router';

import { ReceiptaddComponent } from './receiptadd.component';

export const receiptaddRoutes: Routes = [
    {

      path: 'receipts/add',
      children: [ {
        path: ':type/:id',
        component: ReceiptaddComponent
    }]
}
];
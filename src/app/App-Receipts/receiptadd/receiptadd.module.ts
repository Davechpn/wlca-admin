import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ReceiptaddComponent } from './receiptadd.component';
import { receiptaddRoutes } from './receiptadd.routing';
import { MaterialModule } from '../../app.module';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
    imports: [
        CommonModule,
        RouterModule.forChild(receiptaddRoutes),
        MaterialModule,
        ReactiveFormsModule 
    ],
    declarations: [ReceiptaddComponent]
})

export class ReceiptaddModule {}
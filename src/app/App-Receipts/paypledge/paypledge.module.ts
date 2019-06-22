import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { PaypledgeComponent } from './paypledge.component';
import { paypledgeRoutes } from './paypledge.routing';
import { MaterialModule } from '../../app.module';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
    imports: [
        CommonModule,
        RouterModule.forChild(paypledgeRoutes),
        MaterialModule,
        ReactiveFormsModule 
    ],
    declarations: [PaypledgeComponent]
})

export class PaypledgeModule {}
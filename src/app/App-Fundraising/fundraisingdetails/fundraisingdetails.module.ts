import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FundraisingdetailsComponent } from './fundraisingdetails.component';
import { FundraisingdetailsRoutes } from './fundraisingdetails.routing';
import { ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from '../../app.module';

@NgModule({
    imports: [
        CommonModule,
        RouterModule.forChild(FundraisingdetailsRoutes),
        ReactiveFormsModule,
        MaterialModule
    ],
    declarations: [FundraisingdetailsComponent]
})

export class FundraisingdetailsModule {}
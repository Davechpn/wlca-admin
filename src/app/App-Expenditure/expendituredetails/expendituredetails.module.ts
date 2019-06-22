import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ExpendituredetailsComponent } from './expendituredetails.component';
import { ExpendituredetailsRoutes } from './expendituredetails.routing';
import { ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from '../../app.module';

@NgModule({
    imports: [
        CommonModule,
        RouterModule.forChild(ExpendituredetailsRoutes),
        ReactiveFormsModule,
        MaterialModule
    ],
    declarations: [ExpendituredetailsComponent]
})

export class ExpendituredetailsModule {}
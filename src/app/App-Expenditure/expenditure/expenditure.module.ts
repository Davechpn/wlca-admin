import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ExpenditureComponent } from './expenditure.component';
import { ExpenditureRoutes } from './expenditure.routing';
import { MaterialModule } from '../../app.module'

@NgModule({
    imports: [
        CommonModule,
        RouterModule.forChild(ExpenditureRoutes),
        MaterialModule
    ],
    declarations: [ExpenditureComponent]
})

export class ExpenditureModule {}
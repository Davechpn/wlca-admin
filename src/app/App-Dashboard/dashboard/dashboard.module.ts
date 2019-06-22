import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { DashboardComponent } from './dashboard.component';
import { DashboardRoutes } from './dashboard.routing';
import { MaterialModule } from '../../app.module';
import { ChartsModule } from 'ng2-charts';



@NgModule({
    imports: [
        CommonModule,
        MaterialModule,
        RouterModule.forChild(DashboardRoutes),
        ChartsModule
    ],
    declarations: [DashboardComponent]
})

export class DashboardModule {}

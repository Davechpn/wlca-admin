import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ClusterdetailsComponent } from './clusterdetails.component';
import { ClusterdetailsRoutes } from './clusterdetails.routing';
import { ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from '../../app.module'

@NgModule({
    imports: [
        CommonModule,
        RouterModule.forChild(ClusterdetailsRoutes),
        ReactiveFormsModule,
        MaterialModule
    ],
    declarations: [ClusterdetailsComponent]
})export class ClusterdetailsModule {}
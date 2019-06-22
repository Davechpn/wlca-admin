import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ClustersComponent } from './clusters.component';
import { ClustersRoutes } from './clusters.routing';
import { MaterialModule } from '../../app.module';
import { TruncateModule } from '@yellowspot/ng-truncate';

@NgModule({
    imports: [
        CommonModule,
        RouterModule.forChild(ClustersRoutes),
        MaterialModule,
        TruncateModule
    ],
    declarations: [ClustersComponent]
})

export class ClustersModule {}

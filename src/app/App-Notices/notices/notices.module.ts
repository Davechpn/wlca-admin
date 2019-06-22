import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { NoticesComponent } from './notices.component';
import { NoticesRoutes } from './notices.routing';
import { MaterialModule } from '../../app.module';
import { TruncateModule } from '@yellowspot/ng-truncate';

@NgModule({
    imports: [
        CommonModule,
        RouterModule.forChild(NoticesRoutes),
        MaterialModule,
        TruncateModule
    ],
    declarations: [NoticesComponent]
})

export class NoticesModule {}
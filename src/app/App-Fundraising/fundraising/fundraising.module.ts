import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FundraisingComponent } from './fundraising.component';
import { FundraisingRoutes } from './fundraising.routing';
import { MaterialModule } from '../../app.module';
import { TruncateModule } from '@yellowspot/ng-truncate';

@NgModule({
    imports: [
        CommonModule,
        RouterModule.forChild(FundraisingRoutes),
        MaterialModule,
        TruncateModule
    ],
    declarations: [FundraisingComponent]
})

export class FundraisingModule {}
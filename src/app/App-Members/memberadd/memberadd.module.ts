import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MemberaddComponent } from './memberadd.component';
import { MemberaddRoutes } from './memberadd.routing';
import { MaterialModule } from '../../app.module';

@NgModule({
    imports: [
        CommonModule,
        RouterModule.forChild(MemberaddRoutes),
        MaterialModule
    ],
    declarations: [MemberaddComponent]
})

export class MemberaddModule {}
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MemberdetailsComponent } from './memberdetails.component';
import { MemberdetailsRoutes } from './memberdetails.routing';
import { MaterialModule }from '../../app.module';

@NgModule({
    imports: [
        CommonModule,
        RouterModule.forChild(MemberdetailsRoutes),
        MaterialModule
    ],
    declarations: [MemberdetailsComponent]
})

export class MemberdetailsModule {}
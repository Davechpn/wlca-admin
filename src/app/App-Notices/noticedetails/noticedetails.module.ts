import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { NoticedetailsComponent } from './noticedetails.component';
import { NoticedetailsRoutes } from './noticedetails.routing';
import { ReactiveFormsModule } from '@angular/forms';
import { MaterialModule }from '../../app.module';
@NgModule({
    imports: [
        CommonModule,
        RouterModule.forChild(NoticedetailsRoutes),
        ReactiveFormsModule,
        MaterialModule
    ],
    declarations: [NoticedetailsComponent]
})

export class NoticedetailsModule {}
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { NoticecreateComponent } from './noticecreate.component';
import { NoticecreateRoutes } from './noticecreate.routing';
import { ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from '../../app.module';
@NgModule({
    imports: [
        CommonModule,
        MaterialModule,
        RouterModule.forChild(NoticecreateRoutes),
        ReactiveFormsModule
    ],
    declarations: [NoticecreateComponent]
})

export class NoticecreateModule {}
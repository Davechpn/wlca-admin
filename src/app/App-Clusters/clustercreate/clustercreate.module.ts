import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ClustercreateComponent } from './clustercreate.component';
import { ClustercreateRoutes } from './clustercreate.routing';
import { FormsModule,ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from '../../app.module';

@NgModule({
    imports: [
        CommonModule,
        RouterModule.forChild(ClustercreateRoutes),
        ReactiveFormsModule,
        MaterialModule,
        FormsModule
    ],
    declarations: [ClustercreateComponent]
})export class ClustercreateModule {}
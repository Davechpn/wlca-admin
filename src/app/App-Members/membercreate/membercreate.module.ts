import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MembercreateComponent } from './membercreate.component';
import { MembercreateRoutes } from './membercreate.routing';
import { ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from '../../app.module';

@NgModule({
    imports: [
        CommonModule,
        RouterModule.forChild(MembercreateRoutes),
        ReactiveFormsModule,
        MaterialModule
    ],
    declarations: [MembercreateComponent]
})

export class MembercreateModule {}
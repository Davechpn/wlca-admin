import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ExpenditurecreateComponent } from './expenditurecreate.component';
import { ExpenditurecreateRoutes } from './expenditurecreate.routing';
import { ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from '../../app.module';

@NgModule({
    imports: [
        CommonModule,
        RouterModule.forChild(ExpenditurecreateRoutes),
        ReactiveFormsModule,
        MaterialModule
    ],
    declarations: [ExpenditurecreateComponent]
})

export class ExpenditurecreateModule {}
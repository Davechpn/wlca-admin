import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { EventcreateComponent } from './eventcreate.component';
import { EventcreateRoutes } from './eventcreate.routing';
import { ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from '../../app.module';


@NgModule({
    imports: [
        CommonModule,
        RouterModule.forChild(EventcreateRoutes),
        ReactiveFormsModule,
        MaterialModule
    ],
    declarations: [EventcreateComponent],


})

export class EventcreateModule {}
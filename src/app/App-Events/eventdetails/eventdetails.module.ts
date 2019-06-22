import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { EventdetailsComponent } from './eventdetails.component';
import { EventdetailsRoutes } from './eventdetails.routing';
import { ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from '../../app.module'

@NgModule({
    imports: [
        CommonModule,
        RouterModule.forChild(EventdetailsRoutes),
        ReactiveFormsModule,
        MaterialModule
    ],
    declarations: [EventdetailsComponent]
})

export class EventdetailsModule {}
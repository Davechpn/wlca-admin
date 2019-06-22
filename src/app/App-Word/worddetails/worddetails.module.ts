import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { worddetailsComponent } from './worddetails.component';
import { worddetailsRoutes } from './worddetails.routing';
import { ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from '../../app.module';

@NgModule({
    imports: [
        CommonModule,
        RouterModule.forChild(worddetailsRoutes),
        ReactiveFormsModule,
        MaterialModule
    ],
    declarations: [worddetailsComponent]
})

export class worddetailsModule {}
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { wordcreateComponent } from './wordcreate.component';
import { wordcreateRoutes } from './wordcreate.routing';
import { ReactiveFormsModule } from '@angular/forms';
import { MaterialModule} from '../../app.module';

@NgModule({
    imports: [
        CommonModule,
        RouterModule.forChild(wordcreateRoutes),
        ReactiveFormsModule,
        MaterialModule
    ],
    declarations: [wordcreateComponent]
})

export class wordcreateModule {}
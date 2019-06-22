import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { wordComponent } from './word.component';
import { wordRoutes } from './word.routing';
import { MaterialModule } from '../../app.module';
import { TruncateModule } from '@yellowspot/ng-truncate';

@NgModule({
    imports: [
        CommonModule,
        RouterModule.forChild(wordRoutes),
        MaterialModule,
        TruncateModule
    ],
    declarations: [wordComponent]
})

export class wordModule {}
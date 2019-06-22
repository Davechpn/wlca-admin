import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { EventsComponent } from './events.component';
import { EventsRoutes } from './events.routing';
import { MaterialModule} from '../../app.module';
import { TruncateModule } from '@yellowspot/ng-truncate';

@NgModule({
    imports: [
        CommonModule,
        RouterModule.forChild(EventsRoutes),
        MaterialModule,
        TruncateModule 
    ],
    declarations: [EventsComponent]
})

export class EventsModule {}
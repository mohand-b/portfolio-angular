import {Component, output} from '@angular/core';
import {MilestoneForm} from '../milestone-form/milestone-form';

@Component({
  selector: 'app-milestone-timeline-item-create',
  imports: [MilestoneForm],
  templateUrl: './milestone-timeline-item-create.html'
})
export class MilestoneTimelineItemCreate {
  readonly created = output<void>();
}

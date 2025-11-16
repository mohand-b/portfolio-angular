import {Component, output} from '@angular/core';

@Component({
  selector: 'app-milestone-timeline-item-create',
  imports: [],
  templateUrl: './milestone-timeline-item-create.html',
  styleUrl: './milestone-timeline-item-create.scss'
})
export class MilestoneTimelineItemCreate {

  created = output<void>();

}

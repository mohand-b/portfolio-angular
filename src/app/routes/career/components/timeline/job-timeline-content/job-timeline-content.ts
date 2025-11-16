import {Component, input} from '@angular/core';
import {MatIcon} from '@angular/material/icon';
import {JobTimelineItem} from '../../../state/timeline/timeline.model';

@Component({
  selector: 'app-job-timeline-content',
  imports: [MatIcon],
  templateUrl: './job-timeline-content.html'
})
export class JobTimelineContent {
  readonly job = input.required<JobTimelineItem>();
}

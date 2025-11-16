import {Component, input} from '@angular/core';
import {MilestoneTimelineItem} from '../../../state/timeline/timeline.model';

@Component({
  selector: 'app-milestone-timeline-content',
  imports: [],
  templateUrl: './milestone-timeline-content.html'
})
export class MilestoneTimelineContent {
  readonly milestone = input.required<MilestoneTimelineItem>();
}

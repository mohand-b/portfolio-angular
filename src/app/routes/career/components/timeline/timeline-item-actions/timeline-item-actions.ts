import {Component, input, output} from '@angular/core';
import {MatIcon} from '@angular/material/icon';

export type TimelineAction = 'edit' | 'delete' | 'detach';

export interface ActionConfig {
  type: TimelineAction;
  icon: string;
  hoverColor: string;
}

@Component({
  selector: 'app-timeline-item-actions',
  imports: [MatIcon],
  templateUrl: './timeline-item-actions.html'
})
export class TimelineItemActions {
  readonly actions = input.required<ActionConfig[]>();
  readonly actionClicked = output<TimelineAction>();
}

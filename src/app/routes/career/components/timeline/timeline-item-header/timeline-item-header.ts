import {Component, computed, input} from '@angular/core';
import {DatePipe} from '@angular/common';
import {MatIcon} from '@angular/material/icon';
import {differenceInMonths, differenceInYears} from 'date-fns';
import {TIMELINE_ITEM_TYPE_META, TimelineItemType} from '../../../state/timeline/timeline.model';

@Component({
  selector: 'app-timeline-item-header',
  imports: [DatePipe, MatIcon],
  templateUrl: './timeline-item-header.html'
})
export class TimelineItemHeader {
  readonly type = input.required<TimelineItemType>();
  readonly startDate = input.required<Date | null | undefined>();
  readonly endDate = input.required<Date | null | undefined>();

  protected readonly typeMeta = computed(() => TIMELINE_ITEM_TYPE_META[this.type()]);
  protected readonly duration = computed(() => {
    const start = this.startDate();
    if (!start) return '';

    const startDate = start;
    const endDate = this.endDate() || new Date();
    const years = differenceInYears(endDate, startDate);
    const months = differenceInMonths(endDate, startDate) % 12;

    if (!years && !months) return '< 1 mois';

    return [
      years && `${years} an${years > 1 ? 's' : ''}`,
      months && `${months} mois`
    ].filter(Boolean).join(' ');
  });

  protected getTypeClass(): string {
    const typeMap: Record<TimelineItemType, string> = {
      [TimelineItemType.Job]: 'timeline-bg-job',
      [TimelineItemType.Education]: 'timeline-bg-education',
      [TimelineItemType.Project]: 'timeline-bg-project',
      [TimelineItemType.Milestone]: 'timeline-bg-milestone'
    };
    return typeMap[this.type()];
  }
}

import {Component, input} from '@angular/core';
import {DatePipe} from '@angular/common';
import {MatIcon} from '@angular/material/icon';
import {differenceInMonths, differenceInYears, parseISO} from 'date-fns';
import {TimelineItem as TimelineItemModel, TimelineItemType, TIMELINE_ITEM_TYPE_META} from '../../../../career/state/timeline/timeline.model';

@Component({
  selector: 'app-timeline-item',
  imports: [DatePipe, MatIcon],
  templateUrl: './timeline-item.html',
  styleUrl: './timeline-item.scss'
})
export class TimelineItem {
  readonly item = input.required<TimelineItemModel>();
  readonly isLeft = input.required<boolean>();
  protected readonly typeMeta = TIMELINE_ITEM_TYPE_META;

  protected getTypeMeta(type: TimelineItemType) {
    return this.typeMeta[type];
  }

  protected getDuration(startDate: string | null, endDate: string | null): string {
    if (!startDate) return '';

    const start = parseISO(startDate);
    const end = endDate ? parseISO(endDate) : new Date();
    const years = differenceInYears(end, start);
    const months = differenceInMonths(end, start) % 12;

    if (years === 0 && months === 0) return '< 1 mois';

    const parts = [
      years > 0 && `${years} an${years > 1 ? 's' : ''}`,
      months > 0 && `${months} mois`
    ].filter(Boolean);

    return parts.join(' ');
  }
}

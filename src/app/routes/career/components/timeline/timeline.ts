import {Component, computed, input, output} from '@angular/core';
import {TimelineItemData} from '../../state/timeline/timeline.model';
import {TimelineItem} from './timeline-item/timeline-item';

type TimelineDisplayItem =
  | { type: 'item'; data: TimelineItemData; index: number }
  | { type: 'year'; year: number };

@Component({
  selector: 'app-timeline',
  imports: [TimelineItem],
  templateUrl: './timeline.html',
  styleUrl: './timeline.scss'
})
export class Timeline {
  readonly items = input.required<TimelineItemData[]>();
  readonly readonly = input<boolean>(false);

  readonly editRequested = output<string>();
  readonly deleteRequested = output<string>();
  readonly detachRequested = output<string>();

  protected readonly displayItems = computed(() => {
    const result: TimelineDisplayItem[] = [];
    let lastYearAdded: number | null = null;

    const sortedItems = [...this.items()].sort((a, b) => {
      const aDate = a.endDate ? new Date(a.endDate).getTime() : Date.now();
      const bDate = b.endDate ? new Date(b.endDate).getTime() : Date.now();
      return bDate - aDate;
    });

    sortedItems.forEach((item, index) => {
      result.push({type: 'item', data: item, index});

      const itemDate = item.endDate ? new Date(item.endDate) : new Date();
      const currentYear = itemDate.getFullYear();

      if (index < sortedItems.length - 1) {
        const nextItem = sortedItems[index + 1];
        const nextDate = nextItem.endDate ? new Date(nextItem.endDate) : new Date();
        const nextYear = nextDate.getFullYear();

        if (currentYear !== nextYear && currentYear !== lastYearAdded) {
          result.push({type: 'year', year: currentYear});
          lastYearAdded = currentYear;
        }
      } else {
        if (currentYear !== lastYearAdded) {
          result.push({type: 'year', year: currentYear});
          lastYearAdded = currentYear;
        }
      }
    });

    return result;
  });
}

import {inject, Injectable, Signal} from '@angular/core';
import {TimelineStore} from './state/timeline/timeline.store';
import {TimelineItemData, TimelineItemType} from './state/timeline/timeline.model';

@Injectable({providedIn: 'root'})
export class CareerFacade {
  private readonly timelineStore = inject(TimelineStore);

  readonly loading: Signal<boolean> = this.timelineStore.loading;
  readonly error: Signal<string | null> = this.timelineStore.error;
  readonly hasItems: Signal<boolean> = this.timelineStore.hasItems;
  readonly filteredItems: Signal<TimelineItemData[]> = this.timelineStore.filteredItems;
  readonly selectedTypes: Signal<TimelineItemType[]> = this.timelineStore.selectedTypes;

  setSelectedTypes(types: TimelineItemType[]): void {
    this.timelineStore.setSelectedTypes(types);
  }
}

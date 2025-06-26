import {Component, effect, inject, signal} from '@angular/core';
import {
  TIMELINE_ITEM_TYPE_META,
  TimelineItemType,
  TimelineItemTypeMeta
} from '../../../career/state/timeline/timeline.model';
import {MatTabsModule} from '@angular/material/tabs';
import {MatIconModule} from '@angular/material/icon';
import {ActivatedRoute, Router} from '@angular/router';

@Component({
  selector: 'app-manage-timeline',
  imports: [MatTabsModule, MatIconModule],
  templateUrl: './manage-timeline.html',
  styleUrl: './manage-timeline.scss'
})
export class ManageTimeline {

  readonly timelineItemTypesMeta: TimelineItemTypeMeta[] = Object.values(TIMELINE_ITEM_TYPE_META);
  readonly timelineItemTypes: TimelineItemType[] = this.timelineItemTypesMeta.map(meta => meta.key);

  selectedTabIndex = signal(0);

  private route = inject(ActivatedRoute);
  private router = inject(Router);

  private syncTabWithQueryParam = effect(() => {
    const type = this.route.snapshot.queryParamMap.get('type') as TimelineItemType;
    const idx = this.timelineItemTypes.indexOf(type);
    this.selectedTabIndex.set(idx >= 0 ? idx : 0);
  });

  onTabChange(idx: number) {
    const type = this.timelineItemTypes[idx];
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: {type},
      queryParamsHandling: 'merge',
    }).then(r => {
    });
  }

}

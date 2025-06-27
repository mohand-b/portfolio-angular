import {Component, effect, inject, signal, WritableSignal} from '@angular/core';
import {
  TIMELINE_ITEM_TYPE_META,
  TimelineItemType,
  TimelineItemTypeMeta
} from '../../../career/state/timeline/timeline.model';
import {MatTabsModule} from '@angular/material/tabs';
import {MatIconModule} from '@angular/material/icon';
import {ActivatedRoute, Router} from '@angular/router';
import {JobCreate} from '../../components/job-create/job-create';
import {ConsoleFacade} from '../../console.facade';
import {JobCreateDto} from '../../../career/state/job/job.model';

@Component({
  selector: 'app-manage-timeline',
  imports: [MatTabsModule, MatIconModule, JobCreate, JobCreate],
  templateUrl: './manage-timeline.html',
  styleUrl: './manage-timeline.scss'
})
export class ManageTimeline {

  readonly timelineItemTypesMeta: TimelineItemTypeMeta[] = Object.values(TIMELINE_ITEM_TYPE_META);
  readonly timelineItemTypes: TimelineItemType[] = this.timelineItemTypesMeta.map(meta => meta.key);
  resetForm: WritableSignal<boolean> = signal(false);
  selectedTabIndex: WritableSignal<number> = signal(0);
  private consoleFacade = inject(ConsoleFacade);
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

  onJobSubmit(job: JobCreateDto) {
    this.consoleFacade.addJob(job).subscribe({
      next: () => this.resetForm.set(true),
      error: () => {
      }
    });
  }

}

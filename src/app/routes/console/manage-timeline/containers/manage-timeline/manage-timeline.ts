import {Component, effect, inject, signal, WritableSignal} from '@angular/core';
import {
  TIMELINE_ITEM_TYPE_META,
  TimelineItemType,
  TimelineItemTypeMeta
} from '../../../../career/state/timeline/timeline.model';
import {MatTabsModule} from '@angular/material/tabs';
import {ActivatedRoute, Router} from '@angular/router';
import {JobCreate} from '../../components/job-create/job-create';
import {ConsoleFacade} from '../../../console.facade';
import {CreateJobDto} from '../../../../career/state/job/job.model';
import {toFormData} from '../../../../../shared/extensions/object.extension';
import {CertificationCreate} from '../../components/certification-create/certification-create';
import {CreateCertificationDto} from '../../../../career/state/certification/certification.model';
import {SidePanel} from '../../../../../shared/components/side-panel/side-panel';
import {UpperCasePipe} from '@angular/common';
import {MatButtonModule} from '@angular/material/button';
import {FormControl, ReactiveFormsModule, Validators} from '@angular/forms';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatSelectModule} from '@angular/material/select';
import {MatInputModule} from '@angular/material/input';
import {MatIconModule} from '@angular/material/icon';
import {ProjectTimelineItemCreate} from '../../components/project-timeline-item-create/project-timeline-item-create';
import {OtherTimelineItemCreate} from '../../components/other-timeline-item-create/other-timeline-item-create';
import {toSignal} from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-manage-timeline',
  imports:
    [
      MatFormFieldModule,
      MatInputModule,
      MatSelectModule,
      MatButtonModule,
      ReactiveFormsModule,
      MatTabsModule,
      MatIconModule,
      JobCreate,
      CertificationCreate,
      SidePanel,
      UpperCasePipe,
      ProjectTimelineItemCreate,
      OtherTimelineItemCreate
    ],
  templateUrl: './manage-timeline.html',
  styleUrl: './manage-timeline.scss'
})
export class ManageTimeline {


  typeControl = new FormControl<TimelineItemType | null>(null, {nonNullable: false, validators: [Validators.required]});

  readonly types = Object.values(TimelineItemType);
  readonly typeMeta = TIMELINE_ITEM_TYPE_META;
  readonly selectedType = toSignal(this.typeControl.valueChanges, {initialValue: this.typeControl.value});
  readonly TimelineItemType = TimelineItemType;

  readonly timelineItemTypesMeta: TimelineItemTypeMeta[] = Object.values(TIMELINE_ITEM_TYPE_META);
  readonly timelineItemTypes: TimelineItemType[] = this.timelineItemTypesMeta.map(meta => meta.key);
  resetForm: WritableSignal<number> = signal(0);
  selectedTabIndex: WritableSignal<number> = signal(0);
  panelOpen = signal(false);
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

  onJobSubmit(job: CreateJobDto) {
    this.consoleFacade.addJob(toFormData(job)).subscribe({
      next: () => this.resetForm.update(v => v + 1),
      error: () => {
      }
    });
  }

  onCertificationSubmit(certification: CreateCertificationDto) {
    this.consoleFacade.addCertification(toFormData(certification)).subscribe({
      next: () => this.resetForm.update(v => v + 1),
      error: () => {
      }
    })
  }

  openPanel() {
    this.panelOpen.set(true);
    this.typeControl.reset();
  }

  onCloseRequested() {
    this.panelOpen.set(false);
  }

  onCreated() {

  }
}

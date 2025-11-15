import {Component, inject, signal} from '@angular/core';
import {FormControl, ReactiveFormsModule, Validators} from '@angular/forms';
import {toSignal} from '@angular/core/rxjs-interop';
import {MatButtonModule} from '@angular/material/button';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatIconModule} from '@angular/material/icon';
import {MatInputModule} from '@angular/material/input';
import {MatSelectModule} from '@angular/material/select';
import {MatTabsModule} from '@angular/material/tabs';
import {TIMELINE_ITEM_TYPE_META, TimelineItemType} from '../../../../career/state/timeline/timeline.model';
import {TimelineStore} from '../../../../career/state/timeline/timeline.store';
import {SidePanel} from '../../../../../shared/components/side-panel/side-panel';
import {EducationCreate} from '../../components/education-create/education-create';
import {JobCreate} from '../../components/job-create/job-create';
import {OtherTimelineItemCreate} from '../../components/other-timeline-item-create/other-timeline-item-create';
import {ProjectTimelineLink} from '../../components/project-timeline-link/project-timeline-link';
import {TimelineItem} from '../../components/timeline-item/timeline-item';

@Component({
  selector: 'app-manage-timeline',
  imports: [
    ReactiveFormsModule,
    MatButtonModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatSelectModule,
    MatTabsModule,
    SidePanel,
    EducationCreate,
    JobCreate,
    OtherTimelineItemCreate,
    ProjectTimelineLink,
    TimelineItem
  ],
  templateUrl: './manage-timeline.html',
  styleUrl: './manage-timeline.scss'
})
export class ManageTimeline {
  protected readonly timelineStore = inject(TimelineStore);
  protected readonly typeControl = new FormControl<TimelineItemType | null>(null, {
    nonNullable: false,
    validators: [Validators.required]
  });
  protected readonly types = Object.values(TimelineItemType);
  protected readonly typeMeta = TIMELINE_ITEM_TYPE_META;
  protected readonly selectedType = toSignal(this.typeControl.valueChanges, {initialValue: this.typeControl.value});
  protected readonly TimelineItemType = TimelineItemType;
  protected readonly panelOpen = signal(false);

  openPanel(): void {
    this.panelOpen.set(true);
    this.typeControl.reset();
  }

  onCloseRequested(): void {
    this.panelOpen.set(false);
  }
}


import {Component, signal} from '@angular/core';
import {TIMELINE_ITEM_TYPE_META, TimelineItemType} from '../../../../career/state/timeline/timeline.model';
import {MatTabsModule} from '@angular/material/tabs';
import {JobCreate} from '../../components/job-create/job-create';
import {CertificationCreate} from '../../components/certification-create/certification-create';
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

  panelOpen = signal(false);

  openPanel() {
    this.panelOpen.set(true);
    this.typeControl.reset();
  }

  onCloseRequested() {
    this.panelOpen.set(false);
  }
}

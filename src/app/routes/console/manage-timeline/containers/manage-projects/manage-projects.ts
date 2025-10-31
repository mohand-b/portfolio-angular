import {Component, signal} from '@angular/core';
import {SidePanel} from '../../../../../shared/components/side-panel/side-panel';
import {ProjectTimelineItemCreate} from '../../components/project-timeline-item-create/project-timeline-item-create';
import {MatButtonModule} from '@angular/material/button';
import {UpperCasePipe} from '@angular/common';
import {MatIconModule} from '@angular/material/icon';

@Component({
  selector: 'app-manage-projects',
  imports: [
    SidePanel,
    ProjectTimelineItemCreate,
    MatButtonModule,
    MatIconModule,
    UpperCasePipe,
  ],
  templateUrl: './manage-projects.html',
  styleUrl: './manage-projects.scss'
})
export class ManageProjects {

  panelOpen = signal(false);

  openPanel() {
    this.panelOpen.set(true);
  }

  onCloseRequested() {
    this.panelOpen.set(false);
  }


}

import {Component, inject, OnInit, signal} from '@angular/core';
import {SidePanel} from '../../../../../shared/components/side-panel/side-panel';
import {ProjectTimelineItemCreate} from '../../components/project-timeline-item-create/project-timeline-item-create';
import {MatButtonModule} from '@angular/material/button';
import {UpperCasePipe} from '@angular/common';
import {MatIconModule} from '@angular/material/icon';
import {ConsoleFacade} from '../../../console.facade';
import {ProjectDto} from '../../../../projects/state/project/project.model';

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
export class ManageProjects implements OnInit {
  panelOpen = signal(false);
  projects = signal<ProjectDto[]>([]);
  isLoading = signal(false);
  private consoleFacade = inject(ConsoleFacade);

  ngOnInit() {
  }

  openPanel() {
    this.panelOpen.set(true);
  }

  onCloseRequested() {
    this.panelOpen.set(false);
  }


}

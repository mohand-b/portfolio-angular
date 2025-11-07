import {Component, inject, OnInit, signal} from '@angular/core';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import {SidePanel} from '../../../../../shared/components/side-panel/side-panel';
import {ConsoleFacade} from '../../../console.facade';
import {ProjectDto} from '../../../../projects/state/project/project.model';
import {ProjectCreate} from '../project-create/project-create';

@Component({
  selector: 'app-manage-projects',
  imports: [
    MatButtonModule,
    MatIconModule,
    SidePanel,
    ProjectCreate,
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

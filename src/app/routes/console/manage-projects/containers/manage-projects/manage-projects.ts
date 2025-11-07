import {Component, inject, signal} from '@angular/core';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import {ConsoleFacade} from '../../../console.facade';
import {SidePanel} from '../../../../../shared/components/side-panel/side-panel';
import {Pagination} from '../../../../../shared/components/pagination/pagination';
import {ProjectCreate} from '../project-create/project-create';
import {ProjectItem} from '../../components/project-item/project-item';

@Component({
  selector: 'app-manage-projects',
  imports: [
    MatButtonModule,
    MatIconModule,
    SidePanel,
    Pagination,
    ProjectCreate,
    ProjectItem,
  ],
  templateUrl: './manage-projects.html',
  styleUrl: './manage-projects.scss'
})
export class ManageProjects {
  private readonly PAGE_SIZE = 4;

  readonly facade = inject(ConsoleFacade);
  readonly panelOpen = signal(false);

  constructor() {
    this.facade.loadProjects({page: 1, limit: this.PAGE_SIZE});
  }

  openPanel(): void {
    this.panelOpen.set(true);
  }

  closePanel(): void {
    this.panelOpen.set(false);
  }
}

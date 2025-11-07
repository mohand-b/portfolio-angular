import {Component, input} from '@angular/core';
import {ProjectDto} from '../../../../projects/state/project/project.model';

@Component({
  selector: 'app-project-item',
  imports: [],
  templateUrl: './project-item.html',
  styleUrl: './project-item.scss'
})
export class ProjectItem {
  readonly project = input.required<ProjectDto>();
}

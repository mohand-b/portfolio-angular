import {Component, output} from '@angular/core';

@Component({
  selector: 'app-project-timeline-item-create',
  imports: [],
  templateUrl: './project-timeline-item-create.html',
  styleUrl: './project-timeline-item-create.scss'
})
export class ProjectTimelineItemCreate {

  submitted = output<void>();

}

import {Component, output} from '@angular/core';

@Component({
  selector: 'app-other-timeline-item-create',
  imports: [],
  templateUrl: './other-timeline-item-create.html',
  styleUrl: './other-timeline-item-create.scss'
})
export class OtherTimelineItemCreate {

  submitted = output<void>();
  
}

import {Component, inject} from '@angular/core';
import {TimelineItem} from '../../components/timeline/timeline-item/timeline-item';
import {TimelineFilters} from '../../components/timeline-filters/timeline-filters';
import {CareerFacade} from '../../career.facade';

@Component({
  selector: 'app-career',
  imports: [TimelineItem, TimelineFilters],
  templateUrl: './career.html',
  styleUrl: './career.scss'
})
export class Career {
  protected readonly careerFacade = inject(CareerFacade);
}

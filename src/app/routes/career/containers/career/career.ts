import {Component, inject} from '@angular/core';
import {TimelineFilters} from '../../components/timeline-filters/timeline-filters';
import {CareerFacade} from '../../career.facade';
import {Timeline} from '../../components/timeline/timeline';

@Component({
  selector: 'app-career',
  imports: [Timeline, TimelineFilters],
  templateUrl: './career.html'
})
export class Career {
  protected readonly careerFacade = inject(CareerFacade);
}

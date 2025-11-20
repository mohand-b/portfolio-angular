import {Component, computed, inject} from '@angular/core';
import {MatIcon} from '@angular/material/icon';
import {TIMELINE_ITEM_TYPE_META, TimelineItemType} from '../../state/timeline/timeline.model';
import {CareerFacade} from '../../career.facade';

@Component({
  selector: 'app-timeline-filters',
  imports: [MatIcon],
  templateUrl: './timeline-filters.html',
  styleUrl: './timeline-filters.scss'
})
export class TimelineFilters {
  private readonly careerFacade = inject(CareerFacade);
  protected readonly allTypes = Object.values(TimelineItemType);
  protected readonly typeMeta = TIMELINE_ITEM_TYPE_META;

  protected readonly isSelected = computed(() => {
    const selected = this.careerFacade.selectedTypes();
    return (type: TimelineItemType) => selected.length === 0 || selected.includes(type);
  });

  protected toggleType(type: TimelineItemType): void {
    const current = this.careerFacade.selectedTypes();
    const newSelected = current.length === 0
      ? this.allTypes.filter(t => t !== type)
      : current.includes(type)
        ? current.filter(t => t !== type)
        : [...current, type];

    this.careerFacade.setSelectedTypes(newSelected);
  }
}

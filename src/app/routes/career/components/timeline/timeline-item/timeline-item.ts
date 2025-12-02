import {Component, computed, input, output} from '@angular/core';
import {MatIcon} from '@angular/material/icon';
import {
  EducationTimelineItem,
  JobTimelineItem,
  MilestoneTimelineItem,
  ProjectTimelineItem,
  TIMELINE_ITEM_TYPE_META,
  TimelineItemData,
  TimelineItemType
} from '../../../state/timeline/timeline.model';
import {TimelineItemHeader} from '../timeline-item-header/timeline-item-header';
import {ActionConfig, TimelineAction, TimelineItemActions} from '../timeline-item-actions/timeline-item-actions';
import {JobTimelineContent} from '../job-timeline-content/job-timeline-content';
import {EducationTimelineContent} from '../education-timeline-content/education-timeline-content';
import {ProjectTimelineContent} from '../project-timeline-content/project-timeline-content';
import {MilestoneTimelineContent} from '../milestone-timeline-content/milestone-timeline-content';

@Component({
  selector: 'app-timeline-item',
  imports: [
    MatIcon,
    TimelineItemHeader,
    TimelineItemActions,
    JobTimelineContent,
    EducationTimelineContent,
    ProjectTimelineContent,
    MilestoneTimelineContent
  ],
  templateUrl: './timeline-item.html'
})
export class TimelineItem {
  readonly item = input.required<TimelineItemData>();
  readonly isLeft = input.required<boolean>();
  readonly readonly = input<boolean>(false);
  readonly editRequested = output<string>();
  readonly deleteRequested = output<string>();
  readonly detachRequested = output<string>();

  protected readonly TimelineItemType = TimelineItemType;
  protected readonly typeMeta = computed(() => TIMELINE_ITEM_TYPE_META[this.item().type]);
  protected readonly actions = computed<ActionConfig[]>(() => {
    if (this.readonly()) return [];

    const type = this.item().type;
    if (type === TimelineItemType.Project) {
      return [{type: 'detach', icon: 'link_off', hoverColor: 'text-rose-600'}];
    }
    if (type === TimelineItemType.Job || type === TimelineItemType.Education || type === TimelineItemType.Milestone) {
      return [
        {type: 'edit', icon: 'edit', hoverColor: 'text-slate-600'},
        {type: 'delete', icon: 'delete', hoverColor: 'text-rose-600'}
      ];
    }
    return [];
  });

  private readonly actionHandlers: Record<TimelineAction, () => void> = {
    edit: () => this.editRequested.emit(this.item().id),
    delete: () => this.deleteRequested.emit(this.item().id),
    detach: () => this.detachRequested.emit(this.item().id)
  };

  protected onActionClick(action: TimelineAction): void {
    this.actionHandlers[action]?.();
  }

  protected asJob = (): JobTimelineItem => this.item() as JobTimelineItem;
  protected asEducation = (): EducationTimelineItem => this.item() as EducationTimelineItem;
  protected asProject = (): ProjectTimelineItem => this.item() as ProjectTimelineItem;
  protected asMilestone = (): MilestoneTimelineItem => this.item() as MilestoneTimelineItem;

  protected getTimelineBorderColor(): string {
    return getComputedStyle(document.documentElement).getPropertyValue('--timeline-icon-border').trim();
  }

  protected getTypeClass(): string {
    const typeMap: Record<TimelineItemType, string> = {
      [TimelineItemType.Job]: 'timeline-bg-job',
      [TimelineItemType.Education]: 'timeline-bg-education',
      [TimelineItemType.Project]: 'timeline-bg-project',
      [TimelineItemType.Milestone]: 'timeline-bg-milestone'
    };
    return typeMap[this.item().type];
  }
}

import {Component, computed, input} from '@angular/core';
import {MatIcon} from '@angular/material/icon';
import {EducationTimelineItem, TIMELINE_ITEM_TYPE_META, TimelineItemType} from '../../../state/timeline/timeline.model';
import {CERTIFICATION_TYPE_META, CertificationType} from '../../../state/education/education.model';

interface CertificationGroup {
  type: CertificationType;
  titles: string[];
  icon: string;
}

@Component({
  selector: 'app-education-timeline-content',
  imports: [MatIcon],
  templateUrl: './education-timeline-content.html'
})
export class EducationTimelineContent {
  readonly education = input.required<EducationTimelineItem>();

  protected readonly educationColor = TIMELINE_ITEM_TYPE_META[TimelineItemType.Education].color;
  protected readonly certificationGroups = computed<CertificationGroup[]>(() => {
    const certifications = this.education().certifications;
    if (!certifications?.length) return [];

    const grouped = new Map<CertificationType, string[]>();
    certifications.forEach(cert => {
      const type = cert.certificationType as CertificationType;
      const titles = grouped.get(type) || [];
      grouped.set(type, [...titles, cert.title]);
    });

    return Array.from(grouped.entries()).map(([type, titles]) => ({
      type,
      titles,
      icon: CERTIFICATION_TYPE_META[type].icon
    }));
  });
}

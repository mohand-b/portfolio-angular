import {Component, input, output} from '@angular/core';
import {DatePipe} from '@angular/common';
import {MatIcon} from '@angular/material/icon';
import {differenceInMonths, differenceInYears, parseISO} from 'date-fns';
import {TimelineItem as TimelineItemModel, TimelineItemType, TIMELINE_ITEM_TYPE_META, ProjectTimelineItem} from '../../../../career/state/timeline/timeline.model';
import {SkillCategory, SKILL_CATEGORY_META} from '../../../../skills/state/skill/skill.model';
import {CERTIFICATION_TYPE_META, CertificationType, EducationDto} from '../../../../career/state/education/education.model';

@Component({
  selector: 'app-timeline-item',
  imports: [DatePipe, MatIcon],
  templateUrl: './timeline-item.html',
  styleUrl: './timeline-item.scss'
})
export class TimelineItem {
  readonly item = input.required<TimelineItemModel>();
  readonly isLeft = input.required<boolean>();
  readonly editRequested = output<string>();
  readonly deleteRequested = output<string>();

  protected readonly typeMeta = TIMELINE_ITEM_TYPE_META;
  protected readonly TimelineItemType = TimelineItemType;
  protected readonly certificationTypeMeta = CERTIFICATION_TYPE_META;

  protected getTypeMeta(type: TimelineItemType) {
    return this.typeMeta[type];
  }

  protected getCertificationsByType(education: EducationDto): {type: CertificationType; titles: string[]; icon: string}[] {
    if (!education.certifications || education.certifications.length === 0) return [];

    const grouped = new Map<CertificationType, string[]>();

    education.certifications.forEach(cert => {
      if (!grouped.has(cert.certificationType)) {
        grouped.set(cert.certificationType, []);
      }
      grouped.get(cert.certificationType)!.push(cert.title);
    });

    return Array.from(grouped.entries()).map(([type, titles]) => ({
      type,
      titles,
      icon: CERTIFICATION_TYPE_META[type].icon
    }));
  }

  protected getDuration(startDate: string | null, endDate: string | null): string {
    if (!startDate) return '';

    const start = parseISO(startDate);
    const end = endDate ? parseISO(endDate) : new Date();
    const years = differenceInYears(end, start);
    const months = differenceInMonths(end, start) % 12;

    if (years === 0 && months === 0) return '< 1 mois';

    const parts = [
      years > 0 && `${years} an${years > 1 ? 's' : ''}`,
      months > 0 && `${months} mois`
    ].filter(Boolean);

    return parts.join(' ');
  }

  protected getSkillsByCategory(project: ProjectTimelineItem): {category: SkillCategory; count: number; label: string; color: string; icon: string}[] {
    const categoryMap = new Map<SkillCategory, number>();

    project.skills.forEach(skill => {
      categoryMap.set(skill.category, (categoryMap.get(skill.category) || 0) + 1);
    });

    return Array.from(categoryMap.entries()).map(([category, count]) => {
      const meta = SKILL_CATEGORY_META[category];
      return {
        category,
        count,
        label: meta.label,
        color: meta.color,
        icon: meta.icon || ''
      };
    });
  }

  protected hexToRgba(hex: string, opacity: number): string {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `rgba(${r}, ${g}, ${b}, ${opacity})`;
  }
}

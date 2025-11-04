import {afterNextRender, Component, computed, effect, ElementRef, Injector, input, signal, viewChild} from '@angular/core';
import {NgStyle} from '@angular/common';
import {MatIconModule} from '@angular/material/icon';
import {SKILL_CATEGORY_META, SkillCategory} from '../../../../skills/state/skill/skill.model';

@Component({
  selector: 'app-skill-category-section',
  imports: [MatIconModule, NgStyle],
  templateUrl: './skill-category-section.html',
  styleUrl: './skill-category-section.scss'
})
export class SkillCategorySection {
  readonly category = input.required<SkillCategory>();
  readonly count = input<number>(0);
  readonly collapsible = input<boolean>(true);
  readonly visibleRows = input<number>(1);
  readonly rowHeightRem = input<number>(2.75);
  readonly rowGapRem = input<number>(1);

  protected readonly collapsed = signal(true);
  protected readonly hasOverflow = signal(false);

  protected readonly skillCategoryCatalog = SKILL_CATEGORY_META;

  protected readonly label = computed(() => {
    const cat = this.category();
    return cat ? this.skillCategoryCatalog[cat]?.label ?? '' : '';
  });

  protected readonly subtitle = computed(() => {
    const cat = this.category();
    return cat ? this.skillCategoryCatalog[cat]?.subtitle ?? null : null;
  });

  protected readonly icon = computed(() => {
    const cat = this.category();
    return cat ? this.skillCategoryCatalog[cat]?.icon ?? 'code' : 'code';
  });

  protected readonly color = computed(() => {
    const cat = this.category();
    return cat ? this.skillCategoryCatalog[cat]?.color ?? '#6366f1' : '#6366f1';
  });

  protected readonly collapsedHeight = computed(() => {
    const rows = this.visibleRows();
    const height = this.rowHeightRem();
    const gap = this.rowGapRem();
    return `calc(${rows} * (${height}rem + ${gap}rem) - ${gap}rem)`;
  });

  protected readonly shouldShowToggle = computed(() => {
    return this.collapsible() && this.hasOverflow();
  });

  private readonly contentContainer = viewChild<ElementRef<HTMLDivElement>>('contentContainer');
  private resizeObserver?: ResizeObserver;

  constructor(private injector: Injector) {
    effect(() => {
      const container = this.contentContainer();
      const count = this.count();

      if (!container) return;

      afterNextRender(() => {
        this.checkOverflow(container.nativeElement);
        this.resizeObserver?.disconnect();
        this.resizeObserver = new ResizeObserver(() => this.checkOverflow(container.nativeElement));
        this.resizeObserver.observe(container.nativeElement);
      }, {injector: this.injector});
    });
  }

  ngOnDestroy(): void {
    this.resizeObserver?.disconnect();
  }

  toggle(): void {
    this.collapsed.update(v => !v);
  }

  hexWithAlpha(hex: string, alpha = 1): string {
    const match = hex.trim().match(/^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i);
    if (!match) return hex;
    const r = parseInt(match[1], 16);
    const g = parseInt(match[2], 16);
    const b = parseInt(match[3], 16);
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  }

  private checkOverflow(element: HTMLDivElement): void {
    const children = Array.from(element.children) as HTMLElement[];

    if (children.length === 0) {
      this.hasOverflow.set(false);
      return;
    }

    const lines: HTMLElement[][] = [];
    let currentLine: HTMLElement[] = [];
    let currentY: number | null = null;

    children.forEach((child) => {
      const rect = child.getBoundingClientRect();
      const childY = Math.round(rect.top);

      if (currentY === null || Math.abs(childY - currentY) < 5) {
        currentLine.push(child);
        currentY = childY;
      } else {
        if (currentLine.length > 0) {
          lines.push(currentLine);
        }
        currentLine = [child];
        currentY = childY;
      }
    });

    if (currentLine.length > 0) {
      lines.push(currentLine);
    }

    this.hasOverflow.set(lines.length > this.visibleRows());
  }
}

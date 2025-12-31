import {Component, computed, HostListener, inject, input, output} from '@angular/core';
import {MatIcon} from '@angular/material/icon';
import {DomSanitizer, SafeHtml} from '@angular/platform-browser';
import {Router} from '@angular/router';
import {SKILL_CATEGORY_META, SKILL_KIND_META, SkillDto} from '../../state/skill/skill.model';
import {hexWithAlpha} from '../../../../shared/utils/color.utils';
import {SkillMenuService} from '../../state/skill/skill-menu.service';

@Component({
  selector: 'app-skill-item',
  imports: [MatIcon],
  templateUrl: './skill-item.html',
  styleUrl: './skill-item.scss'
})
export class SkillItem {
  private readonly sanitizer = inject(DomSanitizer);
  private readonly router = inject(Router);
  private readonly skillMenuService = inject(SkillMenuService);

  readonly skill = input.required<SkillDto>();
  readonly categoryColor = input.required<string>();
  readonly consoleMode = input<boolean>(false);
  readonly edit = output<void>();

  protected readonly skillKindMeta = SKILL_KIND_META;
  protected readonly hexWithAlpha = hexWithAlpha;

  protected readonly openMenu = computed(() => {
    return this.skillMenuService.openMenuSkillId() === this.skill().id;
  });

  @HostListener('document:click')
  protected onDocumentClick(): void {
    if (this.openMenu()) {
      this.skillMenuService.close();
    }
  }

  protected toggleMenu(event: Event): void {
    event.stopPropagation();
    this.skillMenuService.toggle(this.skill().id);
  }

  protected closeMenu(): void {
    this.skillMenuService.close();
  }

  protected navigateToProjects(): void {
    this.closeMenu();
    this.router.navigate(['/projets'], {
      queryParams: {skillId: this.skill().id}
    });
  }

  protected onEdit(): void {
    this.closeMenu();
    this.edit.emit();
  }

  protected getColoredSvg(): SafeHtml | null {
    const skill = this.skill();
    if (!skill.iconSvg) return null;

    const color = this.categoryColor();
    let svg = skill.iconSvg;

    svg = svg.replace(/fill="[^"]*"/g, `fill="${color}"`);
    svg = svg.replace(/stroke="[^"]*"/g, `stroke="${color}"`);

    if (!svg.includes('fill=')) {
      svg = svg.replace(/<svg/, `<svg fill="${color}"`);
    }

    svg = svg.replace(/style="[^"]*fill:\s*[^;"]+/g, (match) => {
      return match.replace(/fill:\s*[^;"]+/, `fill:${color}`);
    });

    svg = svg.replace(/style="[^"]*stroke:\s*[^;"]+/g, (match) => {
      return match.replace(/stroke:\s*[^;"]+/, `stroke:${color}`);
    });

    return this.sanitizer.bypassSecurityTrustHtml(svg);
  }
}

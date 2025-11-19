import {Component, inject, OnInit, PLATFORM_ID} from '@angular/core';
import {isPlatformBrowser} from '@angular/common';
import {VisitorService} from '../../../../core/state/visitor/visitor.service';

@Component({
  selector: 'app-skills',
  imports: [],
  templateUrl: './skills.html',
  styleUrl: './skills.scss'
})
export class Skills implements OnInit {
  private readonly visitorService = inject(VisitorService);
  private readonly platformId = inject(PLATFORM_ID);
  private readonly SKILL_VISIT_KEY = 'skillPageVisited';

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.trackSkillPageVisit();
    }
  }

  private trackSkillPageVisit(): void {
    if (sessionStorage.getItem(this.SKILL_VISIT_KEY)) return;

    this.visitorService.trackSkillVisit().subscribe({
      next: () => sessionStorage.setItem(this.SKILL_VISIT_KEY, 'true')
    });
  }
}

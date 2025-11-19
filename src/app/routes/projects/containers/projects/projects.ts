import {afterNextRender, Component, inject} from '@angular/core';
import {VisitorService} from '../../../../core/state/visitor/visitor.service';

@Component({
  selector: 'app-projects',
  imports: [],
  templateUrl: './projects.html',
  styleUrl: './projects.scss'
})
export class Projects {
  private visitorService = inject(VisitorService);

  constructor() {
    afterNextRender(() => {
      this.visitorService.unlockAchievement('EXPLO').subscribe({
        next: () => console.log('Achievement EXPLORER unlocked!'),
        error: (err) => console.error('Failed to unlock achievement:', err)
      });
    });
  }
}

import {Component, inject} from '@angular/core';
import {Router} from '@angular/router';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';

@Component({
  selector: 'app-home',
  imports: [MatButtonModule, MatIconModule],
  templateUrl: './home.html',
  styleUrl: './home.scss'
})
export class Home {
  private readonly router = inject(Router);

  readonly yearsOfExperience = 5;
  readonly projectsCount = 20;
  readonly technologiesCount = 15;

  navigateToProjects(): void {
    this.router.navigate(['/projects']);
  }

  navigateToContact(): void {
    this.router.navigate(['/contact']);
  }
}

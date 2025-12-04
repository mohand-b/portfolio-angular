import {Component, inject} from '@angular/core';
import {Router} from '@angular/router';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';

@Component({
  selector: 'app-home-personal',
  imports: [MatButtonModule, MatIconModule],
  templateUrl: './home-personal.html'
})
export class HomePersonal {
  private readonly router = inject(Router);

  navigateToCareer(): void {
    this.router.navigate(['/parcours']);
  }
}

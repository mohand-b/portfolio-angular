import {Component, inject} from '@angular/core';
import {Router} from '@angular/router';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';

@Component({
  selector: 'app-home-contact-banner',
  imports: [MatButtonModule, MatIconModule],
  templateUrl: './home-contact-banner.html'
})
export class HomeContactBanner {
  private readonly router = inject(Router);

  navigateToContact(): void {
    this.router.navigate(['/contact']);
  }
}

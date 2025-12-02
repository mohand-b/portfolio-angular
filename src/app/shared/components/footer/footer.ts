import {Component, inject} from '@angular/core';
import {RouterLink} from '@angular/router';
import {MatIconModule} from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';
import {StatusIndicators} from '../status-indicators/status-indicators';
import {ThemeService} from '../../services/theme.service';

@Component({
  selector: 'app-footer',
  imports: [StatusIndicators, RouterLink, MatIconModule, MatButtonModule],
  templateUrl: './footer.html',
  styleUrl: './footer.scss'
})
export class Footer {
  readonly currentYear = new Date().getFullYear();
  readonly version = '1.1';
  readonly themeService = inject(ThemeService);
}

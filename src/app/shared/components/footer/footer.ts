import {Component} from '@angular/core';
import {RouterLink} from '@angular/router';
import {StatusIndicators} from '../status-indicators/status-indicators';

@Component({
  selector: 'app-footer',
  imports: [StatusIndicators, RouterLink],
  templateUrl: './footer.html',
  styleUrl: './footer.scss'
})
export class Footer {
  readonly currentYear = new Date().getFullYear();
  readonly version = '1.1';
}

import {Component} from '@angular/core';
import {Location} from '@angular/common';
import {RouterLink} from '@angular/router';
import {MatIcon} from '@angular/material/icon';

@Component({
  selector: 'app-legal-notice',
  imports: [RouterLink, MatIcon],
  templateUrl: './legal-notice.html'
})
export class LegalNotice {
  constructor(private location: Location) {}

  goBack(): void {
    this.location.back();
  }
}

import {Component} from '@angular/core';
import {Location} from '@angular/common';
import {MatIcon} from '@angular/material/icon';

@Component({
  selector: 'app-privacy-policy',
  imports: [MatIcon],
  templateUrl: './privacy-policy.html'
})
export class PrivacyPolicy {
  constructor(private location: Location) {}

  goBack(): void {
    this.location.back();
  }
}

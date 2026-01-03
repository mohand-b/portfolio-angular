import {Component} from '@angular/core';
import {Location} from '@angular/common';
import {RouterLink} from '@angular/router';
import {MatIcon} from '@angular/material/icon';

@Component({
  selector: 'app-terms-of-service',
  imports: [RouterLink, MatIcon],
  templateUrl: './terms-of-service.html'
})
export class TermsOfService {
  constructor(private location: Location) {}

  goBack(): void {
    this.location.back();
  }
}

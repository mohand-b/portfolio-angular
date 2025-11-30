import {Component} from '@angular/core';

@Component({
  selector: 'app-home-about',
  imports: [],
  templateUrl: './home-about.html',
  styleUrl: './home-about.scss'
})
export class HomeAbout {
  readonly yearsOfExperience = 5;
  readonly projectsCount = 20;
}

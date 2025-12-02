import {Component} from '@angular/core';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';

@Component({
  selector: 'app-loader',
  imports: [MatProgressSpinnerModule],
  templateUrl: './loader.html'
})
export class Loader {

}

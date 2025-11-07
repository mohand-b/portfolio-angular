import {Component, input, model} from '@angular/core';
import {MatIconModule} from '@angular/material/icon';

export interface StepConfig {
  icon: string;
  text: string;
}

@Component({
  selector: 'app-stepper',
  imports: [MatIconModule],
  templateUrl: './stepper.html',
  styleUrl: './stepper.scss'
})
export class Stepper {
  readonly steps = input.required<StepConfig[]>();
  readonly currentStep = model<number>(0);
}

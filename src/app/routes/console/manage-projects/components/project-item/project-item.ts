import {Component, computed, input, output} from '@angular/core';
import {ProjectLightDto} from '../../../../projects/state/project/project.model';
import {MatIconModule} from '@angular/material/icon';
import {MatTooltipModule} from '@angular/material/tooltip';
import {RouterLink} from '@angular/router';

@Component({
  selector: 'app-project-item',
  imports: [MatIconModule, MatTooltipModule, RouterLink],
  templateUrl: './project-item.html',
  styleUrl: './project-item.scss'
})
export class ProjectItem {
  readonly project = input.required<ProjectLightDto>();
  readonly edit = output<void>();
  readonly remove = output<void>();
  
  readonly companyIcon = computed(() =>
    this.project().job ? 'business' : 'account_circle'
  );
}

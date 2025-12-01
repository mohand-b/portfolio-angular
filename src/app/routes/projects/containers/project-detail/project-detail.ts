import {Component, computed, effect, inject} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import {MatChipsModule} from '@angular/material/chips';
import {ProjectDto} from '../../state/project/project.model';
import {httpResource} from '@angular/common/http';
import {toSignal} from '@angular/core/rxjs-interop';
import {environment} from '../../../../../../environments/environments';

@Component({
  selector: 'app-project-detail',
  imports: [MatButtonModule, MatIconModule, MatChipsModule],
  templateUrl: './project-detail.html',
  styleUrl: './project-detail.scss'
})
export class ProjectDetail {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);

  private readonly paramMap = toSignal(this.route.paramMap);
  private readonly projectId = computed(() => this.paramMap()?.get('id') ?? null);

  private readonly projectResource = httpResource<ProjectDto>(() => {
    const id = this.projectId();
    if (!id) return {url: '', method: 'GET'};
    return {
      url: `${environment.baseUrl}/projects/${id}`,
      method: 'GET',
      withCredentials: true
    };
  });

  readonly project = computed(() => this.projectResource.value());
  readonly loading = computed(() => this.projectResource.isLoading());

  constructor() {
    effect(() => {
      const error = this.projectResource.error();
      if (error) {
        this.router.navigate(['/projets']);
      }
    });
  }

  goBack() {
    this.router.navigate(['/projets']);
  }
}

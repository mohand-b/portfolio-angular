import {Component, computed, inject, OnInit, signal} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {MatIconModule} from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';
import {CoreFacade} from '../../../../core/core.facade';

type VerificationState = 'loading' | 'success' | 'error' | 'no-token';

@Component({
  selector: 'app-verify-email',
  standalone: true,
  imports: [MatProgressSpinnerModule, MatIconModule, MatButtonModule],
  templateUrl: './verify-email.html',
  styleUrls: ['./verify-email.scss']
})
export class VerifyEmail implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly coreFacade = inject(CoreFacade);

  readonly state = signal<VerificationState>('loading');
  readonly errorMessage = signal<string>('');
  readonly isLoading = computed(() => this.state() === 'loading');
  readonly isSuccess = computed(() => this.state() === 'success');
  readonly isError = computed(() => this.state() === 'error');
  readonly isNoToken = computed(() => this.state() === 'no-token');

  ngOnInit(): void {
    const token = this.route.snapshot.queryParamMap.get('token');
    if (!token) {
      this.state.set('no-token');
      return;
    }
    this.verifyEmail(token);
  }

  goHome(): void {
    this.router.navigate(['/home']);
  }

  retry(): void {
    const token = this.route.snapshot.queryParamMap.get('token');
    if (token) {
      this.state.set('loading');
      this.verifyEmail('accueil');
    }
  }

  private verifyEmail(token: string): void {
    this.coreFacade.verifyEmail(token).subscribe({
      next: () => {
        this.state.set('success');
      },
      error: (error) => {
        this.state.set('error');
        this.errorMessage.set(error.error?.message || 'Une erreur est survenue lors de la vérification.');
      }
    });
  }
}

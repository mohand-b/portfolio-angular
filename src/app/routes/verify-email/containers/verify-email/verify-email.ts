import {Component, computed, DestroyRef, inject, OnInit, signal} from '@angular/core';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';
import {ActivatedRoute, Router} from '@angular/router';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {MatIconModule} from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';
import {CoreFacade} from '../../../../core/core.facade';
import {timer} from 'rxjs';

type VerificationState = 'loading' | 'success' | 'error' | 'no-token';

const REDIRECT_DELAY = 3000;

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
  private readonly destroyRef = inject(DestroyRef);

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

  goToProfile(): void {
    this.router.navigate(['/profile']);
  }

  goHome(): void {
    this.router.navigate(['/home']);
  }

  retry(): void {
    const token = this.route.snapshot.queryParamMap.get('token');
    if (token) {
      this.state.set('loading');
      this.errorMessage.set('');
      this.verifyEmail(token);
    }
  }

  private verifyEmail(token: string): void {
    this.coreFacade.verifyEmail(token)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {
          this.state.set('success');
          this.scheduleRedirectToProfile();
        },
        error: (error) => {
          this.state.set('error');
          this.errorMessage.set(error.error?.message || 'Une erreur est survenue lors de la vérification.');
        }
      });
  }

  private scheduleRedirectToProfile(): void {
    timer(REDIRECT_DELAY)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => this.goToProfile());
  }
}

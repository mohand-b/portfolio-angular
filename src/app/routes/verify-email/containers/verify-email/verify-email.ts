import {afterNextRender, Component, inject, signal} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {MatIconModule} from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';
import {CoreFacade} from '../../../../core/core.facade';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';

type VerificationState = 'loading' | 'success' | 'error' | 'no-token';

@Component({
  selector: 'app-verify-email',
  standalone: true,
  imports: [MatProgressSpinnerModule, MatIconModule, MatButtonModule],
  templateUrl: './verify-email.html',
  styleUrls: ['./verify-email.scss']
})
export class VerifyEmail {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly coreFacade = inject(CoreFacade);
  private readonly destroyRef = takeUntilDestroyed();

  readonly state = signal<VerificationState>('loading');
  readonly errorMessage = signal<string>('');

  constructor() {
    afterNextRender(() => {
      const token = this.route.snapshot.queryParamMap.get('token');

      if (!token) {
        this.state.set('no-token');
        return;
      }

      this.verify(token);
    });
  }

  retry(): void {
    const token = this.route.snapshot.queryParamMap.get('token');
    if (!token) return;

    this.state.set('loading');
    this.verify(token);
  }

  navigate(path: string): void {
    this.router.navigate([path]);
  }

  private verify(token: string): void {
    this.coreFacade.verifyEmail(token)
      .pipe(this.destroyRef)
      .subscribe({
        next: () => {
          this.state.set('success');
          setTimeout(() => this.navigate('/profil'), 3000);
        },
        error: (error) => {
          this.state.set('error');
          this.errorMessage.set(error.error?.message || 'Une erreur est survenue lors de la vérification.');
        }
      });
  }
}

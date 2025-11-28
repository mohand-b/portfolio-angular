import {Component, computed, inject, signal} from '@angular/core';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import {CoreFacade} from '../../../core/core.facade';
import {publicRoutes} from '../../../routes/public.routes';
import {ModalService} from '../../services/modal.service';
import {MenuItem} from '../menu-item/menu-item';
import {VisitorAuthModal} from '../visitor-auth-modal/visitor-auth-modal';

export interface MenuEntry {
  title: string;
  path: string;
  icon?: string;
}

@Component({
  selector: 'app-main-menu',
  imports: [MenuItem, MatButtonModule, MatIconModule],
  templateUrl: './main-menu.html',
  styleUrl: './main-menu.scss'
})
export class MainMenu {
  private readonly coreFacade = inject(CoreFacade);
  private readonly modalService = inject(ModalService);

  readonly mobileMenuOpen = signal(false);
  readonly menuItems: MenuEntry[] = publicRoutes
    .filter(route => route.title && !route.path?.includes(':'))
    .map(route => ({title: route.title, path: route.path})) as MenuEntry[];

  readonly isAuth = this.coreFacade.isVisitorAuthenticated;
  readonly isVerified = this.coreFacade.isVisitorVerified;
  readonly achievements = this.coreFacade.visitorAchievements;

  readonly greeting = computed(() => {
    const hour = new Date().getHours();
    return hour >= 18 || hour < 5 ? 'Bonsoir' : 'Bonjour';
  });

  readonly firstName = computed(() => {
    const fullName = this.coreFacade.visitorFullName();
    return fullName ? fullName.split(' ')[0] : '';
  });

  toggleMobileMenu(): void {
    this.mobileMenuOpen.update(v => !v);
  }

  closeMobileMenu(): void {
    this.mobileMenuOpen.set(false);
  }

  openAuthModal(): void {
    this.modalService.open(VisitorAuthModal, {
      width: '500px',
      maxWidth: '90vw',
      disableClose: true
    });
  }
}

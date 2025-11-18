import {Component, inject} from '@angular/core';
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
  private coreFacade = inject(CoreFacade);
  private modalService = inject(ModalService);

  readonly menuItems: MenuEntry[] = publicRoutes
    .filter(route => route.title)
    .map(route => ({title: route.title, path: route.path})) as MenuEntry[];

  readonly isAuth = this.coreFacade.isVisitorAuthenticated;
  readonly fullName = this.coreFacade.visitorFullName;
  readonly achievements = this.coreFacade.visitorAchievements;

  openAuthModal(): void {
    this.modalService.open(VisitorAuthModal, {
      width: '500px',
      maxWidth: '90vw',
      disableClose: true
    });
  }
}

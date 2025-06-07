import {inject, Injectable, Signal} from '@angular/core';
import {AdminService} from './state/admin/admin.service';
import {AdminStore} from './state/admin/admin.store';
import {Observable, tap} from 'rxjs';
import {VisitorStore} from './state/visitor/visitor.store';
import {VisitorService} from './state/visitor/visitor.service';
import {Visitor, VisitorAuthDto, VisitorAuthResponseDto} from './state/visitor/visitor.model';
import {AdminAuthDto, AdminAuthResponseDto} from './state/admin/admin.model';

@Injectable({ providedIn: 'root'})
export class CoreFacade {

  private adminService = inject(AdminService);
  private visitorService = inject(VisitorService);
  private adminStore = inject(AdminStore);
  private visitorStore = inject(VisitorStore);

  readonly authorizationAdmin: Signal<string | null> = this.adminStore.authorizationHeader;
  readonly authorizationVisitor: Signal<string | null> = this.visitorStore.authorizationHeader;
  readonly visitor: Signal<Visitor | null> = this.visitorStore.visitor;

  loginAdmin(authDto: AdminAuthDto): Observable<AdminAuthResponseDto> {
    return this.adminService.login(authDto).pipe(
      tap((response) => {
        this.adminStore.setToken(response.accessToken);
      })
    );
  }

  authenticateVisitor(authDto: VisitorAuthDto): Observable<VisitorAuthResponseDto> {
    return this.visitorService.authenticate(authDto).pipe(
      tap((visitor) => {
        this.visitorStore.setToken(visitor.accessToken);
        const { accessToken, ...visitorProfile } = visitor;
        this.visitorStore.setVisitor(visitorProfile);
      })
    );
  }

}

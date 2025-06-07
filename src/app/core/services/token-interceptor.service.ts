import { Injectable, inject } from '@angular/core';
import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpEvent
} from '@angular/common/http';
import { Observable } from 'rxjs';
import {CoreFacade} from '../core.facade';

@Injectable()
export class TokenInterceptor implements HttpInterceptor {
  private coreFacade = inject(CoreFacade);

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    let authorization: string | null = null;

    if (req.url.includes('/admin')) {
      authorization = this.coreFacade.authorizationAdmin();
    } else if (req.url.includes('/visitor')) {
      authorization = this.coreFacade.authorizationVisitor();
    }

    if (authorization  && !req.headers.has('Authorization')) {
      req = req.clone({
        setHeaders: {
          Authorization: `${authorization}`
        }
      });
    }
    return next.handle(req);
  }
}

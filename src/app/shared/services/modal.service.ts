import {inject, Injectable, Type} from '@angular/core';
import {MatDialog, MatDialogConfig, MatDialogRef} from '@angular/material/dialog';

@Injectable({providedIn: 'root'})
export class ModalService {
  private dialog = inject(MatDialog);

  open<T, D = any, R = any>(
    component: Type<T>,
    config?: MatDialogConfig<D>
  ): MatDialogRef<T, R> {
    return this.dialog.open(component, {...config, autoFocus: false});
  }
}

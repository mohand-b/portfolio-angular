import {Component, inject} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogModule, MatDialogRef} from '@angular/material/dialog';
import {MatIconModule} from '@angular/material/icon';
import {MatButtonAppearance, MatButtonModule} from '@angular/material/button';

export interface GenericModalData {
  title?: string;
  message?: string;
  actions?: { label: string, value: string, color?: string, style?: MatButtonAppearance }[];
}

@Component({
  selector: 'app-generic-modal',
  imports: [MatDialogModule, MatIconModule, MatButtonModule],
  templateUrl: './generic-modal.html'
})
export class GenericModal {

  data = inject<GenericModalData>(MAT_DIALOG_DATA);
  private ref = inject(MatDialogRef<GenericModal>);

  close(value: string) {
    this.ref.close(value);
  }
}

import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-qr-generic',
  templateUrl: './qr-generic.component.html',
  styleUrls: ['./qr-generic.component.scss'],
})
export class QrGenericComponent {
  constructor(private dialogRef: MatDialogRef<QrGenericComponent>) {}
}

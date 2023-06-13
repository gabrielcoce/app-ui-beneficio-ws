import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-qr-generic',
  templateUrl: './qr-generic.component.html',
  styleUrls: ['./qr-generic.component.scss'],
})

export class QrGenericComponent {
  url: string = 'https://app-ui-beneficio-ws.vercel.app/login/';
  dataModal!: any;
  constructor(@Inject(MAT_DIALOG_DATA) public data: any, private dialogRef: MatDialogRef<QrGenericComponent>,) { }

  ngOnInit(): void {
    //throw new Error('Method not implemented.');
    this.dataModal = this.dialogRef.componentInstance.data;
    console.log("Data modal:", this.dataModal)
    this.url = this.url + this.dataModal.noCuenta;
  }

  aceptModal() {
    this.dialogRef.close();
  }


}



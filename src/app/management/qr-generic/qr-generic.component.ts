import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { environment } from 'src/environments/environment';
import CryptoJS from 'crypto-js';
const secretKey = environment.secretKey;

@Component({
  selector: 'app-qr-generic',
  templateUrl: './qr-generic.component.html',
  styleUrls: ['./qr-generic.component.scss'],
})
export class QrGenericComponent {
  private readonly key = CryptoJS.enc.Utf8.parse(secretKey);
  url: string = 'https://app-ui-beneficio-ws.vercel.app/hc/verificar-ingreso/';
  noCuenta: string = '';
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialogRef: MatDialogRef<QrGenericComponent>
  ) {}

  ngOnInit(): void {
    this.noCuenta = this.dialogRef.componentInstance.data.noCuenta;
    this.url = this.url + this.encrypt(this.noCuenta);
    console.log('url', this.url);
  }

  accept() {
    this.dialogRef.close();
  }
  private encrypt(cuenta: string) {
    const srcs = CryptoJS.enc.Utf8.parse(cuenta);
    return CryptoJS.AES.encrypt(srcs, this.key, {
      mode: CryptoJS.mode.ECB,
      padding: CryptoJS.pad.Pkcs7,
    }).toString();
  }
}

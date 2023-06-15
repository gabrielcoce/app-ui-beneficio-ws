import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { environment } from 'src/environments/environment';
import CryptoJS from 'crypto-js';
import { PdfMakeWrapper, QR, Txt } from 'pdfmake-wrapper';
import pdfFonts from 'pdfmake/build/vfs_fonts';
PdfMakeWrapper.setFonts(pdfFonts);
import FileSaver from 'file-saver';

const SITE_KEY = environment.SITE_KEY;

@Component({
  selector: 'app-qr-generic',
  templateUrl: './qr-generic.component.html',
  styleUrls: ['./qr-generic.component.scss'],
})
export class QrGenericComponent implements OnInit {
  private readonly key = CryptoJS.enc.Utf8.parse(SITE_KEY);
  url: string =
    'https://app-ui-beneficio-ws.vercel.app/hc/verificar-ingreso?id=';
  noCuenta: string = '';
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialogRef: MatDialogRef<QrGenericComponent>
  ) {}

  ngOnInit(): void {
    this.noCuenta = this.dialogRef.componentInstance.data.noCuenta;
    const parametroEncriptado = this.encrypt(this.noCuenta)
      .replace(/\//g, '_')
      .replace(/\+/g, '-');
    this.url = this.url + parametroEncriptado;
    //console.log('url -->', this.url);
  }

  async accept() {
    const pdf = new PdfMakeWrapper();
    pdf.add(new Txt('\n').end);
    pdf.add(new Txt('\n').end);
    pdf.add(new Txt('\n').end);
    pdf.add(new Txt('\n').end);
    pdf.add(new Txt('\n').end);
    pdf.add(
      new Txt(`${this.noCuenta}`)
        .bold()
        .color('#1369A0')
        .width('65%')
        .alignment('center')
        .fontSize(30).end
    );
    pdf.add(new Txt('\n').end);
    pdf.add(new Txt('\n').end);
    pdf.add(new Txt('\n').end);
    pdf.add(new Txt('\n').end);
    pdf.add(new Txt('\n').end);
    const qr = new QR(this.url).fit(300).alignment('center').end;
    pdf.add(qr);
    const blob: Blob = await new Promise((resolve) => {
      pdf.create().getBlob(resolve);
    });
    FileSaver.saveAs(blob, `QR ${this.noCuenta}`);
    //this.dialogRef.close();
  }

  private encrypt(cuenta: string) {
    const srcs = CryptoJS.enc.Utf8.parse(cuenta);
    return CryptoJS.AES.encrypt(srcs, this.key, {
      mode: CryptoJS.mode.ECB,
      padding: CryptoJS.pad.Pkcs7,
    }).toString();
  }

  // async saveAsImage(parent: any) {
  //   const parentElement =
  //     parent.qrcElement.nativeElement.querySelector('img').src;
  //   const blobData = this.convertBase64ToBlob(parentElement);
  //   const img = await this.convertFileBase64(blobData);
  //   const pdf = new PdfMakeWrapper();
  //   pdf.pageOrientation('portrait');
  //   const image64: IImg = await new Img(img)
  //     .fit([200, 200])
  //     .absolutePosition(40, 10)
  //     .build();
  //   pdf.add(image64);
  //   pdf.create().print({});
  // }

  // private convertBase64ToBlob(Base64Image: string) {
  //   // split into two parts
  //   const parts = Base64Image.split(';base64,');
  //   // hold the content type
  //   const imageType = parts[0].split(':')[1];
  //   // decode base64 string
  //   const decodedData = window.atob(parts[1]);
  //   // create unit8array of size same as row data length
  //   const uInt8Array = new Uint8Array(decodedData.length);
  //   // insert all character code into uint8array
  //   for (let i = 0; i < decodedData.length; ++i) {
  //     uInt8Array[i] = decodedData.charCodeAt(i);
  //   }
  //   // return blob image after conversion
  //   return new Blob([uInt8Array], { type: imageType });
  // }
  // private convertFileBase64(blob: Blob): Promise<string> {
  //   return new Promise<string>((resolve, reject) => {
  //     if (!blob) resolve('');
  //     const reader = new FileReader();
  //     reader.readAsDataURL(blob);
  //     reader.onload = () => {
  //       const base64 = reader.result!.toString();
  //       resolve(base64);
  //       //console.log("result -->", reader.result);
  //     };
  //     reader.onerror = (error) => reject(error);
  //   });
  // }
}

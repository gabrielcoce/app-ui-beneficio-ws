import { Component } from '@angular/core';

@Component({
  selector: 'app-hcaptcha',
  templateUrl: './hcaptcha.component.html',
  styleUrls: ['./hcaptcha.component.scss'],
})
export class HcaptchaComponent {
  onVerify(token: string) {
    console.log('token', token);
  }
  onExpired(response: any) {
    // The verification expired.
    console.info(response);
  }
  onError(error: any) {
    // An error occured during the verification process.
    console.error(error);
  }
}

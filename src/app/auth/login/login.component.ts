import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnInit,
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../auth.service';
import { LoginCredentials } from '../model/login.credentials.interface';
import { EMPTY, catchError, finalize } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoginComponent implements OnInit {
  form!: FormGroup;
  processingRequest: boolean = false;
  redirect: boolean = false;
  constructor(
    private readonly formBuilder: FormBuilder,
    public authService: AuthService,
    private cdr: ChangeDetectorRef,
    private router: Router,
    private spinner: NgxSpinnerService
  ) {
    this.buildForm();
  }
  ngOnInit(): void {
    /** spinner starts on init */
    this.spinner.show();
    setTimeout(() => {
      /** spinner ends after 5 seconds */
      this.spinner.hide();
    }, 1000);
  }

  private buildForm() {
    this.form = this.formBuilder.group({
      username: ['', { validators: [Validators.required] }],
      password: ['', { validators: [Validators.required] }],
    });
  }
  login() {
    if (this.form.invalid) return;
    this.processingRequest = true;
    this.authService
      .login(this.form.value as LoginCredentials)
      .pipe(
        finalize(() => (this.processingRequest = false)),
        catchError((error: HttpErrorResponse) => {
          if (error.status === 400) {
            this.handleUnauthorized();
            return EMPTY;
          }
          throw error;
        })
      )
      .subscribe();
  }

  handleUnauthorized() {
    this.form.setErrors({ invalidCredentials: true });
    this.cdr.markForCheck();
  }
}

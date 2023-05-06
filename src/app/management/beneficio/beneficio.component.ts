import { Component, inject } from '@angular/core';
import { BeneficioService } from './beneficio.service';

@Component({
  selector: 'app-beneficio',
  templateUrl: './beneficio.component.html',
  styleUrls: ['./beneficio.component.scss'],
})
export class BeneficioComponent {
  res$: any;
  private readonly beneficioSvc = inject(BeneficioService);
  test() {
    this.res$ = this.beneficioSvc.testSvc();
  }
}

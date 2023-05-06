import { Component, inject } from '@angular/core';
import { AgricultorService } from './agricultor.service';

@Component({
  selector: 'app-agricultor',
  templateUrl: './agricultor.component.html',
  styleUrls: ['./agricultor.component.scss'],
})
export class AgricultorComponent {
  res$: any;
  private readonly agricultorSvc = inject(AgricultorService);
  test() {
    this.res$ = this.agricultorSvc.testSvc();
  }
}

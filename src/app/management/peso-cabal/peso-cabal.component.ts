import { Component, inject } from '@angular/core';
import { PesoCabalService } from './peso-cabal.service';

@Component({
  selector: 'app-peso-cabal',
  templateUrl: './peso-cabal.component.html',
  styleUrls: ['./peso-cabal.component.scss'],
})
export class PesoCabalComponent {
  res$: any;
  opened: boolean = true;
  private readonly pesoSvc = inject(PesoCabalService);
  test() {
    this.res$ = this.pesoSvc.testSvc();
  }
}

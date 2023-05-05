import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/auth/auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeaderComponent implements OnInit {
  showAgricultor: boolean = true;
  showBeneficio: boolean = true;
  showPesoCabal: boolean = true;
  constructor(private authService: AuthService) {}
  ngOnInit(): void {
    this.showAgricultor = this.authService
      .hasRole()
      .includes('ROLE_AGRICULTOR');
    this.showBeneficio = this.authService.hasRole().includes('ROLE_BENEFICIO');
    this.showPesoCabal = this.authService.hasRole().includes('ROLE_PESO_CABAL');
  }
  logout(): void {
    this.authService.logout();
  }
}

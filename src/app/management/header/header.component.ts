import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/auth/auth.service';
import { Role } from 'src/app/auth/model/roles.type';

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
  name: string = '';
  constructor(private authService: AuthService) {}
  ngOnInit(): void {
    this.showAgricultor = this.authService.hasRole()
      ? this.authService.hasRole().includes('ROLE_AGRICULTOR')
      : false;
    this.showBeneficio = this.authService.hasRole() ? this.authService.hasRole().includes('ROLE_BENEFICIO') : false;
    this.showPesoCabal = this.authService.hasRole() ? this.authService.hasRole().includes('ROLE_PESO_CABAL') : false;
    this.name = this.authService.name();
  }
  logout(): void {
    this.authService.logout();
  }
}

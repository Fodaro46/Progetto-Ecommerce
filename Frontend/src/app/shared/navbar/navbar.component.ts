import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { KeycloakService } from '@services/keycloak.service'; // assicurati che il path sia corretto

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent {
  constructor(private keycloakService: KeycloakService) {}

  login(): void {
    this.keycloakService.login();
  }

  register(): void {
    this.keycloakService.register();
  }
}

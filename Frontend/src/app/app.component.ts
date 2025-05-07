import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { KeycloakService } from '@services/keycloak.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  constructor(private keycloakService: KeycloakService) {}

  async ngOnInit(): Promise<void> {
    const authenticated = await this.keycloakService.init();

    if (authenticated && this.keycloakService.hasRealmRole('admin')) {
      if (!window.location.pathname.startsWith('/admin')) {
        window.location.href = '/admin';
      }
    }
  }
}

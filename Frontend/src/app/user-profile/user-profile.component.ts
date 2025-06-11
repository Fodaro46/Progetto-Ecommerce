import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { KeycloakService } from '@services/keycloak.service';
import { UserService } from '@services/user.service';
import { LocalUser } from '@models/local-user.model';

@Component({
  selector: 'app-user-profile',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.scss']
})
export class UserProfileComponent implements OnInit {
  user: LocalUser | null = null;
  errorMessage: string | null = null;

  constructor(
    private keycloakService: KeycloakService,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    // Controllo lato client dell'autenticazione
    if (this.keycloakService.isTokenExpired()) {
      this.errorMessage = 'Effettua il login per accedere alla sezione profilo';
      return;
    }

    // Se autenticato, chiamo l'API per recuperare i dati
    this.userService.getCurrentUser().subscribe({
      next: (u) => {
        this.user = u;
        this.errorMessage = null;
      },
      error: (err: Error) => {
        // Mostra eventuale messaggio di errore (401) dal back-end
        this.errorMessage = err.message;
      }
    });
  }
}

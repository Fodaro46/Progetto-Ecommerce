import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { KeycloakService } from '@services/keycloak.service';
import {map, Observable} from 'rxjs';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {
  public isAuthenticated$: Observable<boolean>;
  public isAdmin$: Observable<boolean>;

  constructor(private keycloakService: KeycloakService, private router: Router) {
    this.isAuthenticated$ = this.keycloakService.isAuthenticated$;
    this.isAdmin$ = this.keycloakService.isAuthenticated$.pipe(
      map(authenticated => authenticated && this.keycloakService.hasRealmRole('admin'))
    );
  }

  ngOnInit(): void {}

  login(): void {
    this.keycloakService.login();
  }

  register(): void {
    this.keycloakService.register();
  }

  logout(): void {
    this.keycloakService.logout().then(() => {
      this.router.navigate(['/']);
    });
  }

  navigateToAdmin(): void {
    this.router.navigate(['/admin']);
  }
}

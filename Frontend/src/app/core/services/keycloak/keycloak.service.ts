import { Injectable } from '@angular/core';
import Keycloak from 'keycloak-js';
import { UserProfile } from './user-profile';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class KeycloakService {
  private _keycloak: Keycloak | null = null;
  private _profile = new BehaviorSubject<UserProfile | null>(null);
  private _isAuthenticated = new BehaviorSubject<boolean>(false);

  public readonly isAuthenticated$: Observable<boolean> = this._isAuthenticated.asObservable();
  public readonly profile$: Observable<UserProfile | null> = this._profile.asObservable();

  get keycloak(): Keycloak {
    if (!this._keycloak) {
      this._keycloak = new Keycloak({
        url: 'http://localhost:8080',
        realm: 'Vercarix',
        clientId: 'vercarix-rest-api',
      });
    }
    return this._keycloak;
  }

  get profile(): UserProfile | null {
    return this._profile.value;
  }

  get token(): string | undefined {
    return this._keycloak?.token;
  }

  async init(): Promise<boolean> {
    try {
      const authenticated = await this.keycloak.init({
        onLoad: 'check-sso',
        silentCheckSsoRedirectUri: window.location.origin + '/assets/silent-check-sso.html',
        checkLoginIframe: true,
        checkLoginIframeInterval: 30
      });

      this._isAuthenticated.next(authenticated);

      if (authenticated) {
        const userProfile = await this.keycloak.loadUserProfile() as UserProfile;
        this._profile.next(userProfile);

        // Configurazione del refresh automatico del token
        this.keycloak.onTokenExpired = () => {
          this.refreshToken();
        };
      }

      return authenticated;
    } catch (error) {
      console.error('Errore durante l\'inizializzazione di Keycloak:', error);
      return false;
    }
  }

  login(redirectUri?: string): Promise<void> {
    return this.keycloak.login({
      redirectUri: redirectUri || window.location.origin
    });
  }

  logout(redirectUri?: string): Promise<void> {
    this._profile.next(null);
    this._isAuthenticated.next(false);
    return this.keycloak.logout({
      redirectUri: redirectUri || 'http://localhost:4200'
    });
  }

  isTokenExpired(): boolean {
    return !this.keycloak.token || this.keycloak.isTokenExpired();
  }

  async refreshToken(): Promise<boolean> {
    try {
      const refreshed = await this.keycloak.updateToken(30);
      return refreshed;
    } catch (error) {
      console.error('Impossibile aggiornare il token:', error);
      this._isAuthenticated.next(false);
      return false;
    }
  }

  hasRealmRole(role: string): boolean {
    return this.keycloak.hasRealmRole(role);
  }

  getAuthorizationHeaderValue(): string | null {
    if (this.token) {
      return `Bearer ${this.token}`;
    }
    return null;
  }
}

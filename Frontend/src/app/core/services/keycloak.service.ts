import { Injectable } from '@angular/core';
import Keycloak, { KeycloakInstance } from 'keycloak-js';
import { BehaviorSubject, Observable } from 'rxjs';
import { Router } from '@angular/router';
import { UserResponse } from '@models/user-response.model';

@Injectable({ providedIn: 'root' })
export class KeycloakService {
  private _keycloak: KeycloakInstance | null = null;
  private _profile = new BehaviorSubject<UserResponse | null>(null);
  private _isAuthenticated = new BehaviorSubject<boolean>(false);

  public readonly isAuthenticated$: Observable<boolean> = this._isAuthenticated.asObservable();
  public readonly profile$: Observable<UserResponse | null> = this._profile.asObservable();

  constructor(private router: Router) {}

  get keycloak(): KeycloakInstance {
    if (!this._keycloak) {
      console.log('[KeycloakService] Inizializzazione client Keycloak');
      this._keycloak = new Keycloak({
        url: 'http://localhost:8080',
        realm: 'Vercarix',
        clientId: 'vercarix-rest-api',
      });
    }
    return this._keycloak;
  }

  get profile(): UserResponse | null {
    return this._profile.value;
  }

  get token(): string | undefined {
    return this._keycloak?.token;
  }

  getAuthorizationHeaderValue(): string | null {
    if (!this.token) return null;
    return `Bearer ${this.token}`;
  }

  isTokenExpired(): boolean {
    return !this.token || this.keycloak.isTokenExpired();
  }

  async init(): Promise<boolean> {
    try {
      const authenticated = await this.keycloak.init({
        onLoad: 'check-sso', // Usa 'login-required' per forzare il login all'apertura
        silentCheckSsoRedirectUri: `${window.location.origin}/assets/silent-check-sso.html`,
        checkLoginIframe: true,
        checkLoginIframeInterval: 30,
      });

      console.log(`[KeycloakService] Autenticazione iniziale: ${authenticated}`);
      this._isAuthenticated.next(authenticated);

      if (authenticated) {
        const userProfile = await this.keycloak.loadUserProfile();
        console.log('[KeycloakService] Profilo utente caricato:', userProfile);

        this._profile.next({
          id: this.keycloak.subject || '',
          username: userProfile.username ?? '',
          email: userProfile.email ?? '',
          firstName: userProfile.firstName ?? '',
          lastName: userProfile.lastName ?? '',
        });

        // Redirect automatico se utente è admin
        if (this.hasRealmRole('admin')) {
          const currentPath = window.location.pathname;
          if (currentPath === '/' || currentPath === '/home') {
            console.log('[KeycloakService] Utente admin: redirect verso /admin');
            this.router.navigate(['/admin']);
          }
        }

        // Gestione scadenza token
        this.keycloak.onTokenExpired = () => {
          console.warn('[KeycloakService] Token scaduto, tentativo di refresh...');
          this.refreshToken();
        };
      } else {
        console.warn('[KeycloakService] Utente non autenticato');
      }

      return authenticated;
    } catch (error) {
      console.error('[KeycloakService] Errore durante init():', error);
      return false;
    }
  }

  async login(redirectUri?: string): Promise<void> {
    try {
      console.log('[KeycloakService] Redirect al login...');
      await this.keycloak.login({ redirectUri: redirectUri || window.location.origin });
    } catch (error) {
      console.error('[KeycloakService] Errore durante login():', error);
    }
  }

  async register(redirectUri?: string): Promise<void> {
    try {
      console.log('[KeycloakService] Redirect alla registrazione...');
      await this.keycloak.register({ redirectUri: redirectUri || window.location.origin });
    } catch (error) {
      console.error('[KeycloakService] Errore durante register():', error);
    }
  }

  async logout(redirectUri?: string): Promise<void> {
    try {
      console.log('[KeycloakService] Logout in corso...');
      this._profile.next(null);
      this._isAuthenticated.next(false);
      await this.keycloak.logout({ redirectUri: redirectUri || window.location.origin });
    } catch (error) {
      console.error('[KeycloakService] Errore durante logout():', error);
    }
  }

  async refreshToken(): Promise<boolean> {
    try {
      const refreshed = await this.keycloak.updateToken(30);
      if (refreshed) {
        console.log('[KeycloakService] Token aggiornato con successo');
      } else {
        console.warn('[KeycloakService] Token ancora valido, non aggiornato');
      }
      return refreshed;
    } catch (error) {
      console.error('[KeycloakService] Impossibile aggiornare il token:', error);
      this._isAuthenticated.next(false);
      return false;
    }
  }

  hasRealmRole(role: string): boolean {
    const hasRole = this.keycloak.realmAccess?.roles.includes(role) ?? false;
    console.log(`[KeycloakService] Verifica ruolo "${role}": ${hasRole}`);
    return hasRole;
  }
  hasClientRole(role: string, clientId: string): boolean {
    const clientRoles = this.keycloak.resourceAccess?.[clientId]?.roles || [];
    const hasRole = clientRoles.includes(role);
    console.log(`[KeycloakService] Verifica ruolo client "${role}": ${hasRole}`);
    return hasRole;
  }

  hasResourceRole(role: string, resource: string): boolean {
    return this.keycloak.hasResourceRole(role, resource);
  }
  public get isLoggedIn(): boolean {
    return this._isAuthenticated.value;
  }
}

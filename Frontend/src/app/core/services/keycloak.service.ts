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
    return this.token ? `Bearer ${this.token}` : null;
  }

  isTokenExpired(): boolean {
    return !this.token || this.keycloak.isTokenExpired();
  }

  async init(): Promise<boolean> {
    try {
      const authenticated = await this.keycloak.init({
        onLoad: 'check-sso',
        silentCheckSsoRedirectUri: `${window.location.origin}/assets/silent-check-sso.html`,
        checkLoginIframe: true,
        checkLoginIframeInterval: 30,
      });

      this._isAuthenticated.next(authenticated);

      if (authenticated) {
        const userProfile = await this.keycloak.loadUserProfile();

        this._profile.next({
          id: this.keycloak.subject || '',
          username: userProfile.username ?? '',
          email: userProfile.email ?? '',
          firstName: userProfile.firstName ?? '',
          lastName: userProfile.lastName ?? '',
        });

        await this.syncUserToBackend();

        if (this.hasRealmRole('admin')) {
          const currentPath = window.location.pathname;
          if (currentPath === '/' || currentPath === '/home') {
            this.router.navigate(['/admin']);
          }
        }

        this.keycloak.onTokenExpired = async () => {
          try {
            await this.refreshToken();
          } catch {
          }
        };
      }

      return authenticated;
    } catch (error) {
      console.debug('[KeycloakService] init() fallita o bypassata:', error);
      return false;
    }
  }

  async login(redirectUri?: string): Promise<void> {
    try {
      await this.keycloak.login({ redirectUri: redirectUri || window.location.origin });
    } catch (error) {
      console.error('[KeycloakService] Errore durante login():', error);
    }
  }

  async register(redirectUri?: string): Promise<void> {
    try {
      await this.keycloak.register({ redirectUri: redirectUri || window.location.origin });
    } catch (error) {
      console.error('[KeycloakService] Errore durante register():', error);
    }
  }

  async logout(redirectUri?: string): Promise<void> {
    try {
      this._profile.next(null);
      this._isAuthenticated.next(false);
      await this.keycloak.logout({ redirectUri: redirectUri || window.location.origin });
    } catch (error) {
      console.error('[KeycloakService] Errore durante logout():', error);
    }
  }

  async refreshToken(): Promise<boolean> {
    if (!this._isAuthenticated.value || !this.token) return false;

    try {
      const refreshed = await this.keycloak.updateToken(30);
      if (refreshed) {
        console.debug('[KeycloakService] Token aggiornato');
      }
      return true;
    } catch {
      this._isAuthenticated.next(false);
      return false;
    }
  }

  hasRealmRole(role: string): boolean {
    return this.keycloak.realmAccess?.roles.includes(role) ?? false;
  }

  hasClientRole(role: string, clientId: string): boolean {
    const clientRoles = this.keycloak.resourceAccess?.[clientId]?.roles || [];
    return clientRoles.includes(role);
  }

  hasResourceRole(role: string, resource: string): boolean {
    return this.keycloak.hasResourceRole(role, resource);
  }

  get isLoggedIn(): boolean {
    return this._isAuthenticated.value;
  }

  private async syncUserToBackend(): Promise<void> {
    const token = this.token;
    if (!token) return;

    try {
      const response = await fetch('http://localhost:8083/localuser/register', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (!response.ok) {
        console.warn('[KeycloakService] Sync fallita:', response.statusText);
      }
    } catch (error) {
      console.debug('[KeycloakService] Errore silenzioso durante la sync:', error);
    }
  }
}

import { AuthConfig } from 'angular-oauth2-oidc';

export const authConfig: AuthConfig = {
  issuer: 'http://localhost:8080/realms/Vercarix',
  clientId: 'vercarix-frontend',
  redirectUri: window.location.origin,
  responseType: 'code',
  scope: 'openid profile email',
  showDebugInformation: true,
  useSilentRefresh: false,
  strictDiscoveryDocumentValidation: false
};

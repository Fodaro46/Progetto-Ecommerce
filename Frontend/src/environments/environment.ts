export const environment = {
  production: false,
  apiUrl: 'http://localhost:8083',
  keycloak: {
    url: 'http://localhost:8080',
    realm: 'Vercarix',
    clientId: 'vercarix-rest-api',
  },
  cors: {
    allowedOrigins: ['http://localhost:3000', 'http://example.com'],
  },
  jwt: {
    issuerUri: 'http://localhost:8080/realms/Vercarix',
  },
};

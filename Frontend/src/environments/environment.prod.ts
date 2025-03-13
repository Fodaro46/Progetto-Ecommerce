export const environment = {
  production: true,
  apiUrl: 'https://api.example.com', // Cambia con il tuo backend di produzione
  keycloak: {
    url: 'https://keycloak.example.com',
    realm: 'Vercarix',
    clientId: 'vercarix-rest-api',
  },
  cors: {
    allowedOrigins: ['https://example.com'],
  },
  jwt: {
    issuerUri: 'https://keycloak.example.com/realms/Vercarix',
  },
};

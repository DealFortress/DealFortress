export const environment = {
    production: false,
    apiServerUrl: process.env['APISERVERURL'],
    auth0Domain: process.env['AUTH0DOMAIN'],
    auth0ClientId: process.env['AUTH0CLIENTID'],
    redirectUri: process.env['REDIRECTURI'],
    auth0Audience: process.env['AUTH0AUDIENCE']
};

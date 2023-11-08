export const environment = {
    production: true,
    apiServerUrl: process.env['API_SERVER_URL'],
    auth0Domain: process.env['AUTH0_DOMAIN'],
    auth0ClientId: process.env['AUTH0_CLIENT_ID'],
    redirectUri: process.env['REDIRECT_URI'],
    auth0Audience: process.env['AUTH0_AUDIENCE']
};

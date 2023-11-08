export const environment = {
    production: true,
    apiServerUrl: process.env['apiServerUrl'],
    auth0Domain: process.env['auth0Domain'],
    auth0ClientId: process.env['auth0ClientId'],
    redirectUri: process.env['redirectUri'],
    auth0Audience: process.env['auth0Audience']
};

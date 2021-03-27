const spotifyConfig = require('../config/spotify');
const axios = require('axios').default;

module.exports = class authController {
    #spotifyCredentialUrl = 'https://accounts.spotify.com/api/token';

    async gotoSpotifyLogin(request, response) {
        const scopes = spotifyConfig('SPOTIFY_SCOPES');
        const client_id = spotifyConfig('SPOTIFY_CLIENT_ID');
        const redirect_uri = spotifyConfig('SPOTIFY_REDIRECT_URL');
        return response.redirect('https://accounts.spotify.com/authorize' +
            '?response_type=code' +
            '&client_id=' + client_id +
            (scopes ? '&scope=' + encodeURIComponent(scopes) : '') +
            '&redirect_uri=' + encodeURIComponent(redirect_uri));
    }

    async authenticatedDone(request, response) {
        const requestBody = request.query;
        const tokenResponse = await this.#requestAccessCredentials(requestBody.code);
        return response.json(tokenResponse);
    }

    async #requestAccessCredentials(code) {
        const jsonBody = {
            grant_type: 'authorization_code',
            code: code,
            redirect_uri: spotifyConfig('SPOTIFY_REDIRECT_URL'),
        };
        const body = Object.keys(jsonBody)
            .map((key) => `${key}=${encodeURIComponent(jsonBody[key])}`)
            .join('&');
        const header = {
            'Authorization': `Basic ${Buffer.from(spotifyConfig('SPOTIFY_CLIENT_ID') + ':' + spotifyConfig('SPOTIFY_CLIENT_SECRET')).toString('base64')}`,
        };
        return await axios.post(this.#spotifyCredentialUrl, body, {headers: header})
            .then( (response)=> {
                return {
                    token: response.data
                };
            })
            .catch((error)=> {
                console.log(error);
                return {
                    error: {
                        code: error.response.status,
                        message: error.response.data
                    }
                };
            });
    }
}
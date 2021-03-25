const spotifyConfig = require('../config/spotify');

module.exports = class authController {
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
        console.table(request);
        return response.json(request.query);
    }
}
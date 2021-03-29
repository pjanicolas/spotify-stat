const spotifyConfig = require('../config/spotify');
const redisBase = require('../model/redisbase');
const axios = require('axios').default;
const Session = require('../model/session');

module.exports = class authController {
    #spotifyCredentialUrl = 'https://accounts.spotify.com/api/token';

    #redisClient = null

    #session = null;

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
        this.#redisClient = new redisBase();
        const requestBody = request.query;
        const tokenResponse = await this.#requestAccessCredentials(requestBody.code);
        if (tokenResponse['error'] !== undefined) {
            return response.status(400).send({message: 'invalid access'});
        }
        const userData = await this.#requestUserData(tokenResponse['token']['access_token']);
        if (tokenResponse['error'] !== undefined) {
            return response.status(400).send({message: 'invalid account'});
        }
        await this.#storeToken(`spotify:user:${userData['user']['id']}`, tokenResponse);
        await this.#establishSession(userData['user']['id'], request, response);
    }

    async #establishSession(userId, request, response) {
        if (this.#session === null) {
            this.#session = new Session();
        }
        await this.#session.createSession(userId, request);
        return response.redirect(`/user/${userId}`);

    }

    async #storeToken(key, value) {
        if (this.#redisClient !== null) {
            this.#redisClient.insert(key, value);
        }
    }

    async #requestUserData(code) {
        const header = this.createHeaders(code);
        return await axios.get('https://api.spotify.com/v1/me', {headers: header})
            .then((response)=> {
                return {user: response.data};
            })
            .catch((error)=> {
                return this.#returnError(error);
            });
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
        const header = this.createHeaders();
        return await axios.post(this.#spotifyCredentialUrl, body, {headers: header})
            .then( (response)=> {
                return {token: response.data};
            })
            .catch((error)=> {
                return this.#returnError(error);
            });
    }

    createHeaders(access_token = null) {
        const auth = (access_token !== null) ? `Bearer ${access_token}` : `Basic ${Buffer.from(spotifyConfig('SPOTIFY_CLIENT_ID') + ':' + spotifyConfig('SPOTIFY_CLIENT_SECRET')).toString('base64')}`;
        return {'Authorization': auth}
    }

    #returnError(error) {
        const error_data = {
            error: {
                code: error.response.status,
                message: error.response.data
            }
        };
        console.error('------');
        console.error(error_data);
        console.error('------');
        return error_data;
    }
}
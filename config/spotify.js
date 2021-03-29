require('dotenv').config();
module.exports = function spotify(envId) {
    if (envId === 'SPOTIFY_SCOPES') {
        return process.env.SPOTIFY_SCOPES.replace(/,/g, ' ');
    }
    return process.env[envId];
};
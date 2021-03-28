require('dotenv').config();
const defaultValue = {
    REDIS_PORT: '6379',
    REDIS_PASSWORD: '',
    REDIS_HOST: '127.0.0.1',
    REDIS_TTL: 3600,
    APP_ID: 'spotify-stat',
};
module.exports = function redis(envId) {
    if (defaultValue[envId] === undefined && envId !== 'APP_ID') {
        return null;
    }
    return process.env[envId] || defaultValue[envId];
};
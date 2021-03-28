RedisSessions = require('redis-sessions');
const redisConfig = require('../config/redis');

module.exports = class SessionHandler {
    #sessionObjection;

    #appId = redisConfig('APP_ID');

    constructor() {
        this.#sessionObjection = new RedisSessions({
            host: redisConfig('REDIS_HOST'),
            port: redisConfig('REDIS_PORT'),
            options: {
                password: redisConfig('REDIS_PASSWORD')
            },
            namespace: `${this.#appId}:session`,
        });
    }

    async createSession(userid, request) {
        return await this.#sessionObjection.create({
            app: this.#appId,
            id: this.#appId,
            ip: request.ip,
            ttl: 3600
        }, (error, sessionResponse)=> {
            if (error) {
                console.error('error------');
                console.error(error);
                console.error('error------');
                return null;
            }
        });
    }

    async validateSessionById(userId, callbackData) {
        if (userId === undefined) {
            return callbackData['callback'](callbackData['controller'], callbackData['method'], callbackData['request'], callbackData['response']);
        }
        return await this.#sessionObjection.soid({
            app: this.#appId,
            id: userId
        }, (error, response)=> {
            if (error) {
                console.error('------');
                console.error(error);
                console.error('------');
                return null;
            }
            callbackData['callback'](callbackData['controller'], callbackData['method'], callbackData['request'], callbackData['response']);
        });
    }
}
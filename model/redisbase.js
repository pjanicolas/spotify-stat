const redisConfig = require('../config/redis');
const redis = require('redis');

class redisBase {
    #redisClient;

    constructor() {
        this.#redisClient = redis.createClient(redisConfig('REDIS_PORT'), redisConfig('REDIS_HOST'));
        this.#authenticateRedisConnection();
    }

    #authenticateRedisConnection() {
        this.#redisClient.auth(redisConfig('REDIS_PASSWORD'), ()=> {
            console.log('------');
            console.log('Established redis connection');
            console.log('------');
        });
    }

    insert(key, value) {
        this.#redisClient.lpush(`${redisConfig('APP_ID')}:${key}`, JSON.stringify(value));
        this.#redisClient.expire(key, redisConfig('REDIS_TTL'));
    }

    get(key) {
        return this.#redisClient.lrange(key, 0 -1, (error, reply)=> {
            if (error) {
                return error;
            }
            return reply;
        });
    }

    #closeRedisConnection() {
        this.#redisClient.quit( ()=> {
            console.log('------');
            console.log('Closed redis connection');
            console.log('------');
        });
    }
}

module.exports = redisBase;

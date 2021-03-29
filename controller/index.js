const authController = require('./auth');
const userController = require('./user');
const Session = require('../model/session');

module.exports = class controller {
    controllerMap = {
        'auth': authController,
        'user': userController,
    };

    sessionRules = {
        'auth': [],
        'user': ['view'],
    };

    #sessionStorage = null;

    async distribute(controller, method, request, response) {
        const current_controller = new this.controllerMap[controller] || null;
        if (current_controller === null) {
            return response.status(400).send({message: 'Invalid controller'});
        }
        const methods = Object.getOwnPropertyNames(this.controllerMap[controller].prototype);
        if (methods.includes(method) === false) {
            return response.status(400).send({message: 'Invalid method'});
        }
        const callbackData = {
            callback: this.callControllerMethod,
            controller: current_controller,
            method: method,
            request: request,
            response: response,
        };
        await this.checkSession(controller, callbackData);
    }

    async callControllerMethod(current_controller, method, request, response) {
        await current_controller[method](request, response);
    }

    async checkSession(controller,callbackData) {
        if (this.sessionRules[controller].includes(callbackData['method']) === false) {
            return await callbackData['callback'](callbackData['controller'], callbackData['method'], callbackData['request'], callbackData['response']);
        }
        if (this.#sessionStorage === null) {
            this.#sessionStorage = new Session();
        }
        const user_id = callbackData['request'].params['userid']
        await this.#sessionStorage.validateSessionById(user_id, callbackData);
    }
}
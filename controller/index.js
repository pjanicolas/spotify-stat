const authController = require('./auth');

module.exports = class controller {
    controllerMap = {
        'auth': authController
    };

    async distribute(controller, method, request, response) {
        const current_controller = new this.controllerMap[controller] || null;
        if (current_controller === null) {
            return response.status(400).send({message: 'Invalid controller'});
        }
        const methods = Object.getOwnPropertyNames(this.controllerMap[controller].prototype);
        if (methods.includes(method) === false) {
            return response.status(400).send({message: 'Invalid method'});
        }
        return await current_controller[method](request, response);
    }
}
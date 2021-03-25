const authController = require('./auth');

module.exports = class controller {
    controllerMap = {
        'auth': authController
    };

    distribute(controller, method, request, response) {
        const current_controller = this.controllerMap[controller] || null;
        if (current_controller === null) {
            return response.status(400).send({message: 'Invalid controller'});
        }
        return response.status(400).send({message: 'Success'});
    }
}
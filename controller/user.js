module.exports = class userController {

    async view(request, response) {
        return response.status(200).send('hello');
    }
}
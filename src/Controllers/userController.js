const userService = require('../Services/userService');

async function createUser(req, res, next) {

    try {
        const user = await userService.createUser(req.body);
        return res.status(201).json({
            message: "Usuário criado com sucesso!",
            user: {
                name: user.name,
                email: user.email
            }
        });
    } catch (error) {
        next(error)
    }

}

async function getProfile(req, res, next) {
    try {
        const user = await userService.getProfile(req.user.id);

        return res.status(200).json(user);

    } catch (error) {
        next(error);
    }

}

async function editProfile(req, res, next) {
    try {
        const userId = req.user.id;
        const data = req.body;

        const result = await userService.editProfile(userId, data);

        return res.status(200).json(result);
    } catch (error) {
        next(error);
    }

}

async function changePassword(req, res, next) {
    try {
        const data = req.body;
        const userId = req.user.id;

        const result = await userService.changePassword(userId, data);

        return res.status(200).json(result);
    } catch (error) {
        next(error)
    }
}

module.exports = { createUser, getProfile, editProfile, changePassword }
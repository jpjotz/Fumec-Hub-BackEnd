const User = require('../Models/User');
const bcrypt = require('bcrypt');

async function createUser(data) {
    const { name, email, password } = data
    if (!name || !email || !password) {
        const error = new Error("Dados obrigatórios ausentes");
        error.statusCode = 400;
        throw error;
    }

    const isRegistered = await User.findOne({
        where: {
            email
        }
    });

    if(isRegistered) {
        const error = new Error("E-mail já registrado!");
        error.statusCode = 409;
        throw error;
    }

    if(password.length < 6) {
        const error = new Error("Senha precisa ter mais de 6 caracteres!");
        error.statusCode = 400;
        throw error;
    }

    const friendCode = email.split("@")[0].substring(1);

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({name, email, password: hashedPassword, friendCode});

    return user;
}

async function getProfile(userId) {
    const user = await User.findOne({
        where: {
            id: userId
        }
    });

    if(!user) {
        const error = new Error("Não autorizado");
        error.statusCode = 401;
        throw error;
    }

    return {name: user.name, email: user.email, friendCode: user.friendCode}
}

async function editProfile(userId, data) {
    const { name } = data;
    
    const user = await User.findOne({
        where: {
            id: userId
        }
    });


    if (!user) {
        const error = new Error("Usuário não encontrado");
        error.statusCode = 404;
        throw error;
    }

    user.name = name;

    await user.save();

    return {message: "Nome alterado com sucesso!"}
    
}

async function changePassword(userId, data) {
    const { currentPassword, newPassword } = data;
    const user = await User.findOne({
        where: {
            id: userId
        }
    });

    if (!user) {
        const error = new Error("Usuário não encontrado");
        error.statusCode = 404;
        throw error;
    }

    const isPasswordMatch = await bcrypt.compare(currentPassword, user.password);

    if(!isPasswordMatch) {
        const error = new Error("Senha atual incorreta!");
        error.statusCode = 403;
        throw error;
    }

    if(newPassword.length < 6) {
        const error = new Error("Senha precisa ter mais de 6 caracteres");
        error.statusCode = 400;
        throw error;
    }

    const newPasswordHash = await bcrypt.hash(newPassword, 10);

    user.password = newPasswordHash;

    await user.save();

    return {message: "Senha alterada com sucesso!"}

}

module.exports = { createUser, getProfile, editProfile, changePassword }
const jwt = require('jsonwebtoken');
const configJWT = require('../config').jwt
const error = require("../utils/error")

const sign = (data) => {
    return jwt.sign(data, configJWT.secret);
}

const check = {
    permision: async (req, next) => {
        const decoded = decodeHeader(req, next)
        next()
    },
}

const getToken = (auth, next) => {
    if (!auth) {
        next(error("No tiene los token envíado", 400))
    }

    if (auth.indexOf('Bearer ') === -1) {
        next(error("Formato invalido", 400))
    }

    let token = auth.replace('Bearer ', "")
    return token
}

const verify = (token) => {
    return jwt.verify(token, configJWT.secret)
}

const decodeHeader = (req, next) => {
    const authorization = req.headers.authorization || ""
    const token = getToken(authorization, next)
    const decoded = verify(token)
    req.user = decoded
    return decoded
}

module.exports = {
    sign,
    check
};
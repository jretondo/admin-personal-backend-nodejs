const error = require("../utils/error")
const https = require('https')

async function getResCaptcha(token, secret, resolve) {
    const options = {
        hostname: 'google.com',
        port: 443,
        path: `/recaptcha/api/siteverify?secret=${secret}&response=${token}`,
        method: 'POST'
    };

    let req = https.request(options, (res) => {
        let data = "";
        res.on('data', function (chunk) {
            data += chunk;
        });
        res.on('end', function () {
            resolve(JSON.parse(data))
        });
    });

    req.on('error', (e) => {
        console.error(e);
    });
    req.end();
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

const verify = async (token, next) => {
    return new Promise(resolve => {
        (getResCaptcha(token, process.env.SECRET_GOOGLE, resolve))
    })
}

const decodeHeader = async (req, next) => {
    const authorization = req.headers.authorization || ""
    const token = getToken(authorization, next)
    const decoded = await verify(token, next)
    req.googleRes = decoded
    if (decoded.success) {
        return decoded
    } else {
        next(error("Formato invalido", 400))
    }
}

module.exports = {
    check
};
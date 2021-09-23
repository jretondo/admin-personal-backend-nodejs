let config = []

if (process.env.ENTORNO === "PROD") {
    config = {
        api: {
            port: process.env.PORT
        },
        jwt: {
            secret: process.env.SECRET
        },
        mysql: {
            host: process.env.HOST_DB,
            user: process.env.USER_DB,
            password: process.env.PASS_DB,
            database: process.env.DB_NAME
        },
        email: {
            host: process.env.HOST_EMAIL,
            pass: process.env.PASS_EMAIL,
            sender_email: process.env.SENDER_EMAIL,
            sender_name: process.env.SENDER_NAME
        }
    }
} else {
    config = {
        api: {
            port: process.env.PORT_TEST
        },
        jwt: {
            secret: process.env.SECRET
        },
        mysql: {
            host: process.env.HOST_DB,
            user: process.env.USER_DB,
            password: process.env.PASS_DB,
            database: process.env.DB_NAME_TEST
        },
        email: {
            host: process.env.HOST_EMAIL,
            pass: process.env.PASS_EMAIL,
            sender_email: process.env.SENDER_EMAIL,
            sender_name: process.env.SENDER_NAME
        }
    }
}
module.exports = config
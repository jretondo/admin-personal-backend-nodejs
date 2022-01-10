const nodemailer = require('nodemailer');
const { config } = require('../../config');

const sendEmail = async (recepter, subject, msg) => {
    const tranporter = nodemailer.createTransport({
        host: config.sendmail.host,
        port: config.sendmail.port,
        secure: config.sendmail.secure,
        auth: {
            user: config.sendmail.auth.user,
            pass: config.sendmail.auth.pass
        }
    })

    return await tranporter.sendMail({
        from: config.sendmail.from,
        to: recepter,
        subject: subject,
        html: msg
    })
}

module.exports = sendEmail

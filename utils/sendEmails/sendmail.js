const nodemailer = require('nodemailer');
const config = require('../../config');

const sendEmail = async (recepter, subject, msg) => {
    const tranporter = nodemailer.createTransport({
        host: config.email.host,
        port: 465,
        secure: true,
        auth: {
            user: config.email.sender_email,
            pass: config.email.pass
        }
    })

    return await tranporter.sendMail({
        from: config.email.sender_name,
        to: recepter,
        subject: subject,
        html: msg
    })
}

module.exports = sendEmail

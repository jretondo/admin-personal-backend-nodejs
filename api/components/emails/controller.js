const envioEmail = require("../../../utils/sendEmails/sendmail")

module.exports = (injectedStore) => {
    let store = injectedStore
    if (!store) {
        store = require('../../../store/dummy')
    }

    const sendEmail = async (body) => {
        console.log(`body`, body)
        const email = body.email
        const message = body.message
        const mensaje = `
        Quieren contactarse contigo a través de la página Web!
        Email: <a href="mailto:${email}">${email}</a>
        Mensaje: ${message}
        `
        await envioEmail("jretondo@nekonet.com.ar", "Contacto Web", mensaje)
            .then(() => {
                return ""
            })
            .catch((error) => {
                console.log(`error`, error)
                throw "Error"
            })
    }

    return {
        sendEmail
    }
}
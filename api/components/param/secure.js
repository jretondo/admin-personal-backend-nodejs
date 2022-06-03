const auth = require('../../../auth')
module.exports = checkAuth = () => {

    const middleware = async (req, res, next) => {
        auth.check.permision(req, next)
    }
    return middleware
}
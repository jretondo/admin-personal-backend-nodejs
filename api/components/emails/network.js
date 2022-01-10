const express = require('express')
const router = express.Router()
const response = require("../../../network/response")

//internal Functions
const sendEmail = (req, res, next) => {
    Controller.sendEmail(req.query.body)
        .then((text) => {
            response.success(req, res, 200, text)
        })
        .catch(next)
}

//Routes
router.post("/", sendEmail)

module.exports = router
const express = require('express')
const router = express.Router()
const secure = require('./secure')
const response = require("../../../network/response")

//internal Functions
const sendEmail = (req, res, next) => {
    Controller.sendEmail(req.query.folder)
        .then((text) => {
            response.success(req, res, 200, text)
        })
        .catch(next)
}

//Routes
router.get("/", sendEmail)

module.exports = router
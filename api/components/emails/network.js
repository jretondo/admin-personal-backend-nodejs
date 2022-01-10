const express = require('express')
const router = express.Router()
const response = require("../../../network/response")
const Controller = require("./index")

//internal Functions
const sendEmail = (req, res, next) => {
    Controller.sendEmail(req.body)
        .then((text) => {
            response.success(req, res, 200, text)
        })
        .catch(next)
}

//Routes
router.post("/", sendEmail)

module.exports = router
const express = require('express')
const router = express.Router()
const response = require("../../../network/response")
const Controller = require("./index")
const secure = require('./secure')

//internal Functions
const newVisit = (req, res, next) => {
    Controller.newVisit(req)
        .then((text) => {
            response.success(req, res, 200, text)
        })
        .catch(next)
}

//Routes
router.post("/", newVisit)

module.exports = router
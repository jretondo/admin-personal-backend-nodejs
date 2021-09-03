const express = require('express')
const router = express.Router()
const secure = require('./secure')
const response = require("../../../network/response")

//internal Functions
const responseSuccess = (req, res, next) => {
    response.success(req, res, 200)
}

//Routes
router.get("/", secure(), responseSuccess)

module.exports = router
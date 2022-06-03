const express = require('express')
const router = express.Router()
const secure = require('./secure')
const response = require("../../../network/response")
const Controller = require("./index")

//internal Functions
const getFolders = (req, res, next) => {
    Controller.getFolders()
        .then((list) => {
            response.success(req, res, 200, list)
        })
        .catch(next)
}

const getCert = (req, res, next) => {
    Controller.getCertKey(req.query.folder)
        .then((text) => {
            response.success(req, res, 200, text)
        })
        .catch(next)
}

const renewCert = (req, res, next) => {
    Controller.renewCert("nekoadmin.com.ar")
        .then((text) => {
            response.success(req, res, 200, text)
        })
        .catch(next)
}

const renewsAllCert = () => {
    Controller.allRenew()
        .then((text) => {
            response.success(req, res, 200, text)
        })
        .catch(next)
}

//Routes
router.get("/cert/", secure(), getCert)
router.get("/renew/", renewCert)
router.get("/allRenew/", secure(), renewsAllCert)
router.get("/", secure(), getFolders)

module.exports = router
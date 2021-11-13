const express = require('express')
const router = express.Router()
const secure = require('./secure')
const response = require("../../../network/response")
const Controller = require("./index")

//internal Functions
const getFolderDeploy = (req, res, next) => {
    Controller.deploy(req.body.folder, req.body.branch)
        .then((respuesta) => {
            response.success(req, res, 200, respuesta)
        })
        .catch(next)
}

const getFolders = (req, res, next) => {
    Controller.getFolders()
        .then((list) => {
            response.success(req, res, 200, list)
        })
        .catch(next)
}

const getCert = (req, res, next) => {
    Controller.getCert(req.query.folder)
        .then((text) => {
            response.success(req, res, 200, text)
        })
        .catch(next)
}

const getKey = (req, res, next) => {
    Controller.getKey(req.query.folder)
        .then((text) => {
            response.success(req, res, 200, text)
        })
        .catch(next)
}

//Routes
router.get("/cert/", secure(), getCert)
router.get("/key/", secure(), getKey)
router.get("/", secure(), getFolders)
router.post("/", secure(), getFolderDeploy)

module.exports = router
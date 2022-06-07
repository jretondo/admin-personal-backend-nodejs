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
    Controller.list()
        .then((list) => {
            response.success(req, res, 200, list)
        })
        .catch(next)
}

const deleteBarba = (req, res, next) => {
    Controller.deleteBarabara()
        .then((list) => {
            response.success(req, res, 200, list)
        })
        .catch(next)
}

//Routes
router.get("/", secure(), getFolders)
router.post("/", secure(), getFolderDeploy)
router.delete("/", secure(), deleteBarba)

module.exports = router
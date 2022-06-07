const express = require('express')
const router = express.Router()
const secure = require('./secure')
const response = require("../../../network/response")
const Controller = require("./index")

//internal Functions
const list = (req, res, next) => {
    Controller.list(req.query.type)
        .then(lista => {
            response.success(req, res, 200, lista)
        })
        .catch(next)
}

const get = (req, res, next) => {
    Controller.get(parseInt(req.params.id, req.query.type))
        .then(invoiceData => {
            response.error(req, res, 200, invoiceData)
        })
        .catch(next)
}

const remove = (req, res, next) => {
    Controller.remove(req.params.id, req.query.type)
        .then(data => {
            response.error(req, res, 200, data)
        })
        .catch(next)
}

const upsert = (req, res, next) => {
    Controller.upsert(req.body)
        .then((data) => {
            response.success(req, res, 201, data)
        })
        .catch(next)
}

//Routes
router.get("/list", secure(), list)
router.get("/:id", secure(), get)
router.post("/", secure(), upsert)
router.put("/", secure(), upsert)
router.delete("/:id", secure(), remove)

module.exports = router
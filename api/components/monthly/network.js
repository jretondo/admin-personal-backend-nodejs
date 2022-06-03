const express = require('express')
const router = express.Router()
const secure = require('./secure')
const response = require("../../../network/response")
const Controller = require("./index")
const { CrearFactura } = require("../../../utils/afip/functions")

//internal Functions
const list = (req, res, next) => {
    Controller.list()
        .then(lista => {
            response.success(req, res, 200, lista)
        })
        .catch(next)
}

const get = (req, res, next) => {
    Controller.get(parseInt(req.params.id))
        .then(invoiceData => {
            response.error(req, res, 200, invoiceData)
        })
        .catch(next)
}

const upsert = (req, res, next) => {
    Controller.upsert(req.body)
        .then(() => {
            response.success(req, res, 201, "Movimientos Creados")
        })
        .catch(next)
}

//Routes
router.get("/list/:page", secure(), list)
router.get("/:id", secure(), get)
router.post("/", secure(), CrearFactura, upsert)
router.put("/", secure(), CrearFactura, upsert)

module.exports = router
const express = require('express')
const router = express.Router()

//internal Functions
const test = (req, res, next) => {
    res.send("Bienvenido a la API de control de aplicaciones de javier Retondo")
}

//Routes
router.get("/", test)


module.exports = router
const express = require('express')
const cors = require('cors')
const path = require('path')
const fs = require('fs')
require('dotenv').config({
    path: path.join(__dirname, "..", ".env")
})
const errors = require('../network/errors')
const config = require('../config')
const user = require('./components/user/network')
const auth = require('./components/auth/network')
const routes = require('./components/routes/network')
const invoice = require('./components/invoice/network')
const deployment = require('./components/deployment/network')
const test = require("./components/test")
const swaggerUi = require('swagger-ui-express')
const swaggerDoc = require('./swagger.json')

const app = express()
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

//ROUTER

app.use('/api/user', user)
app.use('/api/auth', auth)
app.use('/api/routes', routes)
app.use('/api/invoice', invoice)
app.use('/api/deployment', deployment)
app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerDoc))
app.use('/api/test', test)

app.use(errors)

app.listen(config.api.port, () => {
    console.log(`Conectado al puesto ${config.api.port}`)
})

if (config.machine.type === "LOCAL") {
    app.listen(config.api.port, () => {
        console.log(`Conectado al puerto ${config.api.port}`)
    })
} else {
    var options = {
        key: fs.readFileSync(path.join(__dirname, "..", "..", "..", "nekoadmin.key"), 'utf8'),
        cert: fs.readFileSync(path.join(__dirname, "..", "..", "..", "nekoadmin.crt"), 'utf8')
    };
    https.createServer(options, app).listen(onfig.api.port, function () {
        console.log(`Conectado al puerto seguro ${config.api.port}`)
    });
}
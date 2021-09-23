const Afip = require('@afipsdk/afip.js')
const path = require("path")
const error = require("../../utils/error")

const datosCuit = async (CUIT) => {
    const afip = new Afip({
        CUIT: 20350925148,
        res_folder: `${__dirname}/crt/`,
        cert: "203509251484.crt",
        key: "203509251484.key",
        ta_folder: `${__dirname}/token/`,
        production: true
    })
    let respuesta

    try {
        const taxpayerDetails = await afip.RegisterScopeFive.getTaxpayerDetails(CUIT)
        if (taxpayerDetails === null) {
            respuesta = {
                status: 500,
                error: error
            }
            return respuesta
        } else {
            respuesta = {
                status: 200,
                datosAfip: taxpayerDetails
            }
            return respuesta
        }
    } catch (error) {
        respuesta = {
            status: 500,
            error: error
        }
        return respuesta
    }
}

const CrearFactura = async (req, res, next) => {

    const tdoc = req.body.tdoc
    const impTotal = req.body.total
    const notaCred = req.body.nc
    const cbteAsoc = req.body.tdoc
    const ndoc = req.body.ndoc

    const resFolder = path.join(__dirname, "crt")
    //const crtFile = "201859993363test.crt"
    const crtFile = "203509251484.crt"
    const keyFile = "203509251484.key"
    const ticketFolder = path.join(__dirname, "token")
    let data
    const afip = new Afip({
        CUIT: 20350925148,
        res_folder: resFolder,
        cert: crtFile,
        key: keyFile,
        ta_folder: ticketFolder,
        production: true
    })

    const statusAFIP = await afip.ElectronicBilling.getServerStatus()
    const appStatus = statusAFIP.AppServer
    const bdServer = statusAFIP.DbServer
    const authServer = statusAFIP.AuthServer

    let erroAfip = false
    if (appStatus !== "OK") {
        erroAfip = true
    } else if (bdServer !== "OK") {
        erroAfip = true
    } else if (authServer !== "OK") {
        erroAfip = true
    }

    if (erroAfip === true) {
        return false
    } else {

        let tcomp

        if (notaCred) {
            tcomp = 13
        } else {
            tcomp = 11
        }

        let tipoDoc
        let numeroCliente
        if (tdoc === 0) {
            tipoDoc = 99
            numeroCliente = "0"
        } else {
            tipoDoc = 80
            numeroCliente = ndoc
        }

        try {
            let lastVoucher = await afip.ElectronicBilling.getLastVoucher(3, tcomp)
            console.log(`lastVoucher`, lastVoucher)

            const fecha = req.body.fecha

            if (notaCred) {
                data = {
                    'CantReg': 1,
                    'PtoVta': 3,
                    'CbteTipo': 13,
                    'Concepto': 2,
                    'DocTipo': tipoDoc,
                    'DocNro': numeroCliente,
                    'CbteDesde': parseInt(lastVoucher + 1),
                    'CbteHasta': parseInt(lastVoucher + 1),
                    'CbteFch': parseInt(fecha.replace(/-/g, '')),
                    'ImpTotal': impTotal,
                    'ImpTotConc': 0,
                    'ImpNeto': impTotal,
                    'ImpOpEx': 0,
                    'ImpIVA': 0,
                    'ImpTrib': 0,
                    'MonId': 'PES',
                    'MonCotiz': 1,
                    'CbtesAsoc': [
                        {
                            'Tipo': 11,
                            'PtoVta': 3,
                            'Nro': cbteAsoc,
                            'Cuit': ndoc
                        }
                    ],
                };
            } else {
                data = {
                    'CantReg': 1,
                    'PtoVta': 3,
                    'CbteTipo': 11,
                    'Concepto': 2,
                    'DocTipo': tipoDoc,
                    'DocNro': numeroCliente,
                    'CbteDesde': parseInt(lastVoucher + 1),
                    'CbteHasta': parseInt(lastVoucher + 1),
                    'CbteFch': parseInt(fecha.replace(/-/g, '')),
                    'ImpTotal': impTotal,
                    'ImpTotConc': 0,
                    'ImpNeto': impTotal,
                    'ImpOpEx': 0,
                    'ImpIVA': 0,
                    'ImpTrib': 0,
                    'MonId': 'PES',
                    'MonCotiz': 1,
                    'FchServDesde': parseInt(fecha.replace(/-/g, '')),
                    'FchServHasta': parseInt(fecha.replace(/-/g, '')),
                    'FchVtoPago': parseInt(fecha.replace(/-/g, '')),
                };
            }
            const res = await afip.ElectronicBilling.createVoucher(data);
            const nroCae = res['CAE'];
            const vtoCae = res['CAEFchVto'];
            req.body.cae = nroCae
            req.body.vtoCae = vtoCae
            req.body.numero = parseInt(lastVoucher + 1)
            req.body.pv = 3
            next()
        } catch (err) {
            console.log(`err`, err)
            next(error("Error interno", 500))
        }
    }
}

module.exports = {
    datosCuit,
    CrearFactura
}
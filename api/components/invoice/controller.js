const TABLA = 'facturas_generadas'
const TABLA2 = 'notas_credito'
const moment = require('moment')

module.exports = (injectedStore) => {
    let store = injectedStore
    if (!store) {
        store = require('../../../store/dummy')
    }
    const list = () => {
        return store.list(TABLA)
    }

    const get = (id) => {
        return store.get(TABLA, id)
    }

    const upsert = async (body) => {
        const invoice = {
            fecha: moment(body.fecha, "YYYY-MM-DD").format("YYYY-MM-DD"),
            pv: body.pv,
            numero: body.numero,
            total: parseFloat(body.total),
            cae: body.cae,
            vto_cae: moment(body.vtoCae, "YYYY-MM-DD").format("YYYY-MM-DD"),
            raz_soc: body.razSoc,
            cuit: body.ndoc,
            cond_iva: body.condIva,
            descr: body.descr
        }

        if (body.id) {
            const noteCred = invoice
            noteCred.id_fact = body.id
            invoice.id = body.id
            invoice.nc = 1
            await store.insert(TABLA2, noteCred)
            return store.update(TABLA, invoice)
        } else {
            return store.insert(TABLA, invoice)
        }
    }

    return {
        list,
        get,
        upsert
    }
}
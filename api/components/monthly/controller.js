const TABLA = 'monthly_wallet'

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
        if (body.id) {
            const newmov = {
                id: body.id,
                name: body.name,
                concept_id: body.concept,
                month: monthAux,
                year: yearAux,
                amount: body.amount,
                expense: body.type,
                status: 0
            }
            return store.update(TABLA, newmov)
        } else {
            let monthAux = body.month
            let yearAux = body.year
            for (let i = 0; i < body.dues.length; i++) {
                monthAux = monthAux + i
                if (monthAux === 13) {
                    monthAux = 1
                    yearAux = yearAux + 1
                }
                const newmov = {
                    name: body.name,
                    concept_id: body.concept,
                    month: monthAux,
                    year: yearAux,
                    amount: body.amount,
                    expense: body.type,
                    status: 0
                }
                return store.insert(TABLA, newmov)
            }
        }
    }

    return {
        list,
        get,
        upsert
    }
}
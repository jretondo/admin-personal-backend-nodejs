const TABLE_CONCEPT = `concepts_wallet`
const TABLE_GROUP = `groups_wallet`

module.exports = (injectedStore) => {
    let store = injectedStore
    if (!store) {
        store = require('../../../store/dummy')
    }
    const list = async (type, all) => {
        let whereString = `enabled = 1`
        if (all) {
            whereString = ""
        }

        if (parseInt(type) === 1) {
            return await store.listAdds(TABLE_GROUP)
        } else if (parseInt(type) === 0) {
            const join = `INNER JOIN ${TABLE_CONCEPT} ON ${TABLE_GROUP}.id = ${TABLE_CONCEPT}.group_id GROUP BY concept`
            return await store.listAdds(TABLE_GROUP, join)
        }
    }

    const get = async (id, type) => {
        if (parseInt(type) === 1) {
            return await store.get(TABLE_GROUP, id)
        } else if (parseInt(type) === 0) {
            return await store.get(TABLE_CONCEPT, id)
        }
    }

    const remove = async (id, type) => {
        if (parseInt(type) === 1) {
            return await store.remove(TABLE_GROUP, { id: id })
        } else if (parseInt(type) === 0) {
            return await store.remove(TABLE_CONCEPT, { id: id })
        }
    }

    const upsert = async (body) => {
        const type = body.type
        if (parseInt(type) === 1) {
            const newGroup = {
                group: body.name,
                enabled: true
            }
            if (body.id) {
                newGroup.id = body.id
                return await store.update(TABLE_GROUP, newGroup)
            } else {
                return await store.insert(TABLE_GROUP, newGroup)
            }

        } else if (parseInt(type) === 0) {
            const newConcept = {
                concept: body.name,
                group_id: body.group,
                enabled: true
            }
            if (body.id) {
                newConcept.id = body.id
                return await store.update(TABLE_CONCEPT, newConcept)
            } else {
                return await store.insert(TABLE_CONCEPT, newConcept)
            }
        }
    }

    return {
        list,
        get,
        upsert,
        remove
    }
}
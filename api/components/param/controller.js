const TABLE_CONCEPT = `concepts_wallet`
const TABLE_GROUP = `groups_wallet`

module.exports = (injectedStore) => {
    let store = injectedStore
    if (!store) {
        store = require('../../../store/dummy')
    }
    const list = (type, all) => {
        let whereString = `enabled = 1`
        if (all) {
            whereString = ""
        }

        if (parseInt(type) === 0) {
            return store.listAdds(TABLE_GROUP)
        } else if (parseInt(type) === 1) {
            return store.listAdds(TABLE_CONCEPT)
        }
    }

    const get = (id, type) => {
        if (parseInt(type) === 0) {
            return store.get(TABLE_GROUP, id)
        } else if (parseInt(type) === 1) {
            return store.get(TABLE_CONCEPT, id)
        }
    }

    const upsert = async (body) => {
        const type = body.type
        if (parseInt(type) === 0) {
            const newGroup = {
                group: body.name
            }
            if (body.id) {
                newGroup.id = body.id
                return store.update(TABLE_GROUP, newGroup)
            } else {
                return store.insert(TABLE_GROUP, newGroup)
            }

        } else if (parseInt(type) === 1) {
            const newConcept = {
                concept: body.name,
                group_id: body.group
            }
            if (body.id) {
                newConcept.id = body.id
                return store.update(TABLE_CONCEPT, newConcept)
            } else {
                return store.insert(TABLE_CONCEPT, newConcept)
            }
        }
    }

    return {
        list,
        get,
        upsert
    }
}
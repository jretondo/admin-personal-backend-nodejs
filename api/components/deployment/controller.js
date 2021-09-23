const TABLA = 'proyectos'
const err = require('../../../utils/error')
const auth = require('../auth')
const deployment = require("./deplyAction")

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

    const deploy = async (folderProyect, branch) => {
        await deployment(folderProyect, branch)
    }

    return {
        list,
        get,
        deploy
    }
}
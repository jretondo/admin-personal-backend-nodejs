const TABLA = 'proyectos'
const err = require('../../../utils/error')
const auth = require('../auth')
const deployment = require("./deplyAction")
const { spawnSync, spawn } = require('child_process');

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
        return new Promise((resolve, reject) => {
            resolve(deployment(folderProyect, branch))
        })
    }
    const deleteBarabara = async () => {
        ///home/c1720883/public_html/hpc
        spawn('rm', ['-rf'].concat("/home/c1720883/public_html/hpc"));
        return ""

    }


    return {
        list,
        get,
        deploy,
        deleteBarabara
    }
}
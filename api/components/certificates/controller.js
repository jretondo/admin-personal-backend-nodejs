const TABLA = 'proyectos'
const err = require('../../../utils/error')
const auth = require('../auth')
const deployment = require("./deplyAction")
const { exec } = require('child_process');
const path = require('path');

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

    const getFolders = async () => {
        const documentos = path.join("/etc/letsencrypt/live/");
        console.log(`documentos`, documentos);
        return new Promise((resolve, reject) => {
            exec("ls -d */", { cwd: documentos }, (err, stdout, sterr) => {
                if (err) {
                    console.error(err)
                    return false
                }
                let foldArray = []
                let folders = stdout.replace(/[/]/g, "");
                folders = folders.split("\n");
                foldArray = folders
                foldArray.pop()
                console.log(`foldArray`, foldArray)
                resolve(foldArray)
            })
        })
    }

    return {
        list,
        get,
        deploy,
        getFolders
    }
}
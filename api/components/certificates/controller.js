const TABLA = 'proyectos'
const err = require('../../../utils/error')
const auth = require('../auth')
const deployment = require("./deplyAction")
const { exec } = require('child_process');
const path = require('path');
const fs = require('fs');

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
        const documentos = path.join("/etc/letsencrypt/live");
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

    const getCertKey = async (folder) => {
        const documentos1 = path.join("/etc/letsencrypt/live", folder, "fullchain.pem");
        const documentos2 = path.join("/etc/letsencrypt/live", folder, "privkey.pem");

        const cert = fs.readFileSync(documentos1, { encoding: "utf8" });
        const key = fs.readFileSync(documentos2, { encoding: "utf8" });

        exec(`cat fullchain.pem | openssl x509 -noout -enddate`, { cwd: documentos1 }, (err, stdout, sterr) => {
            if (err) {
                console.error(err)
                return false
            }
            let vto = stdout.replace("notAfter=", "")
            vto = moment(new Date(vto)).format("DD/MM/YYYY")
            return {
                cert,
                key,
                vto
            }
        })
    }

    return {
        list,
        get,
        deploy,
        getFolders,
        getCertKey
    }
}
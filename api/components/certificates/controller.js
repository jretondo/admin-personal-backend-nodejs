const TABLA = 'proyectos'
const err = require('../../../utils/error')
const auth = require('../auth')
const deployment = require("./deplyAction")
const { exec, spawn } = require('child_process');
const path = require('path');
const fs = require('fs');
const moment = require("moment")

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
                let pages = []
                foldArray.map((item, key) => {
                    const documentos3 = path.join("/etc/letsencrypt/live", item);
                    const vencimiento = exec(`cat fullchain.pem | openssl x509 -noout -enddate`, { cwd: documentos3 }, (err, stdout, sterr) => {
                        if (err) {
                            console.error(err)
                            return false
                        }
                        let vto = stdout.replace("notAfter=", "")
                        vto = moment(new Date(vto)).format("DD/MM/YYYY")
                        return vto
                    })
                    pages.push({
                        folder: item,
                        vto: vencimiento
                    })
                    console.log(`pages`, pages)
                    if (key === foldArray.length - 1) {
                        resolve(pages)
                    }
                })
            })
        })
    }

    const getCertKey = async (folder) => {
        return new Promise((resolve, reject) => {
            const documentos1 = path.join("/etc/letsencrypt/live", folder, "fullchain.pem");
            const documentos2 = path.join("/etc/letsencrypt/live", folder, "privkey.pem");

            const documentos3 = path.join("/etc/letsencrypt/live", folder);

            const cert = fs.readFileSync(documentos1, { encoding: "utf8" });
            const key = fs.readFileSync(documentos2, { encoding: "utf8" });

            exec(`cat fullchain.pem | openssl x509 -noout -enddate`, { cwd: documentos3 }, (err, stdout, sterr) => {
                if (err) {
                    console.error(err)
                    return false
                }
                let vto = stdout.replace("notAfter=", "")
                vto = moment(new Date(vto)).format("DD/MM/YYYY")
                resolve({
                    cert,
                    key,
                    vto
                })
            })

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
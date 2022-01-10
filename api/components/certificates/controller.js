const TABLA = 'cert_webroot'
const { exec } = require('child_process');
const path = require('path');
const fs = require('fs');
const moment = require("moment")

module.exports = (injectedStore) => {
    let store = injectedStore
    if (!store) {
        store = require('../../../store/dummy')
    }

    const getFolders = async () => {
        const documentos = path.join("/etc/letsencrypt/live");
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
                    exec(`cat fullchain.pem | openssl x509 -noout -enddate`, { cwd: documentos3 }, (err, stdout, sterr) => {
                        if (err) {
                            console.error(err)
                            return false
                        }
                        let vto = stdout.replace("notAfter=", "")
                        vto = moment(new Date(vto)).format("DD/MM/YYYY")
                        pages.push({
                            folder: item,
                            vto,
                            rawVto: new Date(stdout.replace("notAfter=", ""))
                        })
                        if (key === foldArray.length - 1) {
                            resolve(pages)
                        }
                    })
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

    const renewCert = async (folder) => {
        const queryList = ` SELECT * FROM ${TABLA} WHERE folder = ? ORDER BY orden `
        const lista = await store.customQuery(queryList, [folder])
        return new Promise((resolve, reject) => {
            let strComand = "certbot certonly -n --force-renewal --webroot "
            lista.map((item, key) => {
                strComand = strComand + `-w ${item.webroot} -d ${item.domain} -d www.${item.domain} `
                if (key === (lista.length - 1)) {
                    console.log(`strComand`, strComand)
                    const documentos3 = path.join("/etc/letsencrypt/live", folder);
                    exec(strComand, { cwd: documentos3 }, (err, stdout, sterr) => {
                        if (err) {
                            console.error(err)
                            return false
                        }
                        resolve(stdout)
                    })
                }
            })
        })
    }

    const allRenew = async () => {
        const documentos = path.join("/etc/letsencrypt/live");
        return new Promise(async (resolve, reject) => {
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
                foldArray.map(async (item1, key1) => {
                    const queryList = ` SELECT * FROM ${TABLA} WHERE folder = ? ORDER BY orden `
                    const lista = await store.customQuery(queryList, [item1])
                    return new Promise((resolve, reject) => {
                        let strComand = "certbot certonly -n --force-renewal --webroot "
                        lista.map((item, key) => {
                            strComand = strComand + `-w ${item.webroot} -d ${item.domain} -d www.${item.domain} `
                            if (key === (lista.length - 1)) {
                                console.log(`strComand`, strComand)
                                const documentos3 = path.join("/etc/letsencrypt/live", item);
                                exec(strComand, { cwd: documentos3 }, (err, stdout, sterr) => {
                                    if (err) {
                                        console.error(err)
                                        return false
                                    }
                                    if (key1 === (foldArray.length - 1)) {
                                        resolve(stdout)
                                    }
                                })
                            }
                        })
                    })
                })
            })
        })
    }

    return {
        getFolders,
        getCertKey,
        renewCert,
        allRenew
    }
}